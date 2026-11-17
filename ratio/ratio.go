package ratio

import (
	"encoding/json"
	"math"
	"net/http"
	"strconv"
	"strings"
)

const rimBSD = 622.0

type Result struct {
	Chainring    int     `json:"chainring"`
	Cog          int     `json:"cog"`
	Ratio        float64 `json:"ratio"`
	GearInches   float64 `json:"gearInches"`
	DevelopmentM float64 `json:"developmentM"`
	SpeedKmh     float64 `json:"speedKmh"`
	SkidPatches  int     `json:"skidPatches"`
	AmbiPatches  int     `json:"ambiPatches"`
}

func gcd(a, b int) int {
	for b != 0 {
		a, b = b, a%b
	}
	return a
}

func Calc(chainring, cog int, tireMM, cadence float64) Result {
	diameter := rimBSD + 2*tireMM
	ratio := float64(chainring) / float64(cog)
	dev := ratio * math.Pi * diameter / 1000
	g := gcd(chainring, cog)
	skid := cog / g
	ambi := skid
	if (chainring/g)%2 == 1 {
		ambi = skid * 2
	}
	r2 := func(v float64) float64 { return math.Round(v*100) / 100 }
	return Result{chainring, cog, r2(ratio), r2(ratio * diameter / 25.4), r2(dev), r2(dev * cadence * 60 / 1000), skid, ambi}
}

func num(r *http.Request, key string, def, min, max float64) (float64, bool) {
	s := r.URL.Query().Get(key)
	if s == "" {
		return def, true
	}
	v, err := strconv.ParseFloat(s, 64)
	return v, err == nil && v >= min && v <= max
}

func Single(w http.ResponseWriter, r *http.Request) {
	chainring, ok1 := num(r, "chainring", 48, 28, 60)
	cog, ok2 := num(r, "cog", 17, 9, 24)
	tire, ok3 := num(r, "tire", 25, 18, 60)
	cadence, ok4 := num(r, "cadence", 90, 20, 200)
	if !(ok1 && ok2 && ok3 && ok4) {
		http.Error(w, "invalid parameters", http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Calc(int(chainring), int(cog), tire, cadence))
}

func Batch(w http.ResponseWriter, r *http.Request) {
	tire, ok1 := num(r, "tire", 25, 18, 60)
	cadence, ok2 := num(r, "cadence", 90, 20, 200)
	combos := strings.Split(r.URL.Query().Get("combos"), ",")
	if !(ok1 && ok2) || len(combos) > 120 {
		http.Error(w, "invalid parameters", http.StatusBadRequest)
		return
	}
	out := make([]Result, 0, len(combos))
	for _, c := range combos {
		a, b, found := strings.Cut(c, "x")
		chainring, err1 := strconv.Atoi(a)
		cog, err2 := strconv.Atoi(b)
		if !found || err1 != nil || err2 != nil || chainring < 28 || chainring > 60 || cog < 9 || cog > 24 {
			http.Error(w, "invalid combo: "+c, http.StatusBadRequest)
			return
		}
		out = append(out, Calc(chainring, cog, tire, cadence))
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(out)
}

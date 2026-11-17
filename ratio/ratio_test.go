package ratio

import (
	"encoding/json"
	"net/http/httptest"
	"testing"
)

func TestRatios(t *testing.T) {
	w := httptest.NewRecorder()
	Batch(w, httptest.NewRequest("GET", "/api/ratios?combos=48x17,49x14&tire=25&cadence=60", nil))
	var got []Result
	if err := json.NewDecoder(w.Body).Decode(&got); err != nil || len(got) != 2 || got[0] != Calc(48, 17, 25, 60) || got[1].AmbiPatches != 4 {
		t.Fatalf("ratios: %v %+v", err, got)
	}
	for _, q := range []string{"combos=48-17", "combos=48x8", "combos=", "combos=48x17&tire=5"} {
		w = httptest.NewRecorder()
		Batch(w, httptest.NewRequest("GET", "/api/ratios?"+q, nil))
		if w.Code != 400 {
			t.Fatalf("%s: want 400, got %d", q, w.Code)
		}
	}
}

func TestCalc(t *testing.T) {
	r := Calc(48, 17, 25, 60)
	if r.SkidPatches != 17 || r.AmbiPatches != 17 || r.Ratio != 2.82 || r.GearInches != 74.7 || r.DevelopmentM != 5.96 || r.SpeedKmh != 21.46 {
		t.Fatalf("48x17: %+v", r)
	}
	r = Calc(49, 14, 25, 90)
	if r.SkidPatches != 2 || r.AmbiPatches != 4 {
		t.Fatalf("49x14: %+v", r)
	}
	r = Calc(48, 16, 25, 90)
	if r.SkidPatches != 1 || r.AmbiPatches != 2 {
		t.Fatalf("48x16: %+v", r)
	}
}

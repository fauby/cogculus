package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"

	"fixie-ratio/ratio"
)

//go:embed web/dist
var dist embed.FS

func main() {
	static, _ := fs.Sub(dist, "web/dist")
	http.HandleFunc("/api/ratio", ratio.Single)
	http.HandleFunc("/api/ratios", ratio.Batch)
	files := http.FileServer(http.FS(static))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if !strings.HasPrefix(r.URL.Path, "/assets/") {
			w.Header().Set("Cache-Control", "no-cache")
		}
		files.ServeHTTP(w, r)
	})
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("listening on :" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

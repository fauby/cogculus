package handler

import (
	"net/http"

	"fixie-ratio/ratio"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	ratio.Single(w, r)
}

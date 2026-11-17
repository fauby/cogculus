FROM node:24-alpine AS web
WORKDIR /web
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

FROM golang:1.26-alpine AS go
WORKDIR /src
COPY go.mod *.go ./
COPY --from=web /web/dist web/dist
RUN go test ./... && CGO_ENABLED=0 go build -o /fixie-ratio .

FROM alpine
COPY --from=go /fixie-ratio /fixie-ratio
EXPOSE 8080
CMD ["/fixie-ratio"]

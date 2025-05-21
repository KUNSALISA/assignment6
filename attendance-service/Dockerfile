FROM golang:1.23 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o attendance-service main.go

FROM gcr.io/distroless/base-debian12

WORKDIR /app

COPY --from=builder /app/attendance-service .

EXPOSE 5002

CMD ["/app/attendance-service"]

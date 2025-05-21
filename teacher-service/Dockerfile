FROM golang:1.23 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o teacher-service main.go

FROM gcr.io/distroless/base-debian12

WORKDIR /app

COPY --from=builder /app/teacher-service .

EXPOSE 5001

CMD ["/app/teacher-service"]

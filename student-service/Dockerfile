FROM golang:1.23 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o student-service main.go

FROM gcr.io/distroless/base-debian12

WORKDIR /app

COPY --from=builder /app/student-service .

EXPOSE 5002

CMD ["/app/student-service"]

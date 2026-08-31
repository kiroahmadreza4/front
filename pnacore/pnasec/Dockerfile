# مرحله 1: build کردن برنامه
FROM golang:1.26-alpine AS builder

# نصب ابزارهای مورد نیاز
RUN apk add --no-cache git

# تنظیم پوشه کاری
WORKDIR /app

# کپی کردن فایل‌های go.mod و go.sum
COPY go.mod go.sum ./

# دانلود وابستگی‌ها
RUN go mod download

# کپی کردن کل سورس کد
COPY . .

# کامپایل کردن برنامه
RUN go build -o main ./cmd/server

# مرحله 2: اجرای برنامه
FROM alpine:latest

# نصب CA certificates برای HTTPS
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# کپی کردن فایل اجرایی از مرحله قبل
COPY --from=builder /app/main .

# کپی کردن فایل‌های کانفیگ (اگه نیاز باشه)
COPY --from=builder /app/config ./config

# پورت برنامه (پیش‌فرض معمولاً 8080)
EXPOSE 8080

# اجرای برنامه
CMD ["./main"]

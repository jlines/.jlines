export PATH="~/bin:$PATH"

pwgen() {
  openssl rand -base64 "${1:-24}" | tr -d '\n' | cut -c1-"${1:-24}"
  echo
}

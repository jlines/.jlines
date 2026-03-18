alias hi="history | grep -i $1"
alias sorg='aws dynamodb scan --table-name manifest-organization'
alias nv=nvim
alias solsta_login_dev='export SOLSTA_ACCESS_TOKEN=$(solsta_cli login prompt --org=snxd --out=json,minify --display_token=true --stage=dev | jq -Rr "fromjson? | select(.type == \"STOP\") | .accessToken")'
alias solsta_login_qa='export SOLSTA_ACCESS_TOKEN=$(solsta_cli login prompt --org=ssnqa --out=json,minify --display_token=true --stage=qa | jq -Rr "fromjson? | select(.type == \"STOP\") | .accessToken")'
alias solsta_login_prod='export SOLSTA_ACCESS_TOKEN=$(solsta_cli login prompt --org=snxd --out=json,minify --display_token=true --stage=prod | jq -Rr "fromjson? | select(.type == \"STOP\") | .accessToken")'
alias bot='openclaw tui'
alias bebot='sudo -u openclaw-agent bash'

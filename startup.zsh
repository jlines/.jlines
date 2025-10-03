# If not already inside tmux, start it
if command -v tmux &> /dev/null && [ -z "$TMUX" ]; then
  tmux attach -t main || tmux new -s main
fi


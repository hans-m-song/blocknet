CC = browserify
DIR = src/
OUT = src/compiled/
JS = message.js # block.js contract.js deploy.js

.PHONY: all

all: $(JS)
		$(CC) $(DIR)$(JS) > $(DIR)$(OUT)

%.js: %.js
		$(CC) $(DIR)$< -o $(OUT)$@
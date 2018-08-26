OUT = src/bundle.js
JS = src/block.js src/message.js src/bundle.js

.PHONY: all

all: 
		browserify $(JS) > $(OUT)

watch: 
		watchify $(JS) -o $(OUT)
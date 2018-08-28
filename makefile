CC := browserify
OUT = src/compiled/
JS = src/message.js # src/contract.js src/deploy.js

.PHONY: msg

all: msg block
#		$(CC) $(JS) > $(OUT)bundle.js

msg:
		$(CC) src/message.js -o $(OUT)message.js

block:
		$(CC) src/deploy.js -o $(OUT)deploy.js
	

clean:
		rm -rf $(OUT)*

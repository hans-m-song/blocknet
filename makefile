CC = browserify
OUT = src/compiled/
JS = src/message.js # src/contract.js src/deploy.js

.PHONY: msg

all: 
		$(CC) $(JS) > $(OUT)bundle.js

msg:
		$(CC) src/message.js > $(OUT)message.js

clean:
		rm -rf $(OUT)*
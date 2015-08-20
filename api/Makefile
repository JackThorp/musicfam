
ISTANBUL = ./node_modules/.bin/istanbul
MOCHA = ./node_modules/.bin/mocha

node_modules: 
	npm install

test: node_modules
	$(MOCHA) --recursive --compilers coffee:coffee-script/register --require coffee-coverage/register-istanbul test && $(ISTANBUL) report && open ./coverage/lcov-report/index.html

.PHONY: test

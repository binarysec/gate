cmd_Release/obj.target/core.node := g++ -shared -pthread -rdynamic -m64  -Wl,-soname=core.node -o Release/obj.target/core.node -Wl,--start-group Release/obj.target/core/nreg/utils.o Release/obj.target/core/nreg/module.o Release/obj.target/core/nreg/nreg.o Release/obj.target/core/nreg/nreg_wrap.o Release/obj.target/core/nreg/unicode.o -Wl,--end-group 
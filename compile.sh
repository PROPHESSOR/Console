#!/bin/sh
echo "#====================================#"
echo "#JsMobileBasic compiler by PROPHESSOR#"
echo "#-----http://PROPHESSOR.16mb.com-----#"
echo "#====================================#"
sleep 1s
clear
echo Compiling....
rm -rf output
cd project
zip -r project.mbc ./
cd ..
cp -r nw output
cp project/project.mbc output/
cd output
cat nw project.mbc > app.sh
chmod +x app.sh
rm -f project.mbc
rm -f nw
rm -f ../project/project.mbc
clear
echo "#====Completed!====#"
sleep 1s
cd output
./app.sh

#include <iostream>
#include <string>

int dayOfWeek(int y, int m, int d){
    int t[]={0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4};
    y -= (m<3) ? 1 : 0;
    return (y + y/4 - y/100 + y/400 + t[m-1] + d) % 7;
}

int main(int argc, char** argv){
    if(argc != 4){
        std::cout<<"usage is: program YYYY MM DD"<<std::endl;
        return -1;
    }
    int year=std::stoi(argv[1]);
    int month=std::stoi(argv[2]);
    int day=std::stoi(argv[3]);
    std::string days[7]={"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
    std::cout<<days[dayOfWeek(year, month, day)]<<std::endl;
    return 0;
}

def day_of_week(year, month, day)
  t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4]
  year -= (month < 3) ? 1 : 0
  dow = (year + year/4 - year/100 + year/400 + t[month-1] + day) % 7
  return case dow
         when 0
           "Sunday"
         when 1
           "Monday"
         when 2
           "Tuesday"
         when 3
           "Wednesday"
         when 4
           "Thursday"
         when 5
           "Friday"
         when 6
           "Saturday"
         else
           "Unknown"
         end
end

puts day_of_week 1886, 5, 1
puts day_of_week 1948, 12, 10
puts day_of_week 2001, 1, 15
puts day_of_week 2017, 10, 10
puts day_of_week 2018, 1, 1
puts day_of_week 2018, 2, 16
puts day_of_week 2018, 5, 17

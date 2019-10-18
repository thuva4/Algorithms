function LinearSearch(Table, Value)
    for i, v in pairs(Table) do
        if v == Value then
            return i
        end
    end
end

LinearSearch({3, 4, 5, 9, 1}, 9) -- 4

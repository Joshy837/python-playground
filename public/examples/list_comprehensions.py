numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

squares = [x**2 for x in numbers]
print("Squares:", squares)

evens = [x for x in numbers if x % 2 == 0]
print("Evens:", evens)

pairs = [(x, y) for x in range(1, 4) for y in range(1, 4) if x != y]
print("Pairs:", pairs)

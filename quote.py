import csv


class quote:
    def __build__words__csv(path):
        
        with open(path) as csv_file:
            result = []
            csv_reader = csv.read(csv_file)
            line_count = 0
            number_count = 0

            for row in csv_reader:
                
                if line_count == 0:
                    print(f'Column names are {", ".join(row)}')

                elif line_count == 'random' & number_count < 20 :
                    result.append(row[0])
                    number_count = number_count + 1

                line_count = line_count +1 
        
        return result

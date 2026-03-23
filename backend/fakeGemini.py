import random
from urllib import response

from matplotlib import lines
from requests import options

def generateQuizQuestion(topic):
    if(topic == "biology"):
        bioQuestionBank = [
            "Question: What is the basic unit of life?\nA. Atom\nB. Cell\nC. Tissue\nD. Organ\nCorrect Answer: B",

            "Question: Which molecule carries genetic information?\nA. RNA\nB. DNA\nC. Protein\nD. Lipid\nCorrect Answer: B",

            "Question: What organelle is responsible for protein synthesis?\nA. Mitochondria\nB. Nucleus\nC. Ribosome\nD. Golgi apparatus\nCorrect Answer: C",

            "Question: What process do plants use to make food?\nA. Respiration\nB. Digestion\nC. Photosynthesis\nD. Fermentation\nCorrect Answer: C",

            "Question: Which gas do plants absorb from the atmosphere?\nA. Oxygen\nB. Nitrogen\nC. Carbon dioxide\nD. Hydrogen\nCorrect Answer: C",

            "Question: What is the function of the cell membrane?\nA. Store DNA\nB. Produce energy\nC. Control what enters and leaves the cell\nD. Make proteins\nCorrect Answer: C",

            "Question: Which organelle contains DNA in eukaryotic cells?\nA. Ribosome\nB. Cytoplasm\nC. Nucleus\nD. Lysosome\nCorrect Answer: C",

            "Question: What type of cells lack a nucleus?\nA. Eukaryotic cells\nB. Plant cells\nC. Animal cells\nD. Prokaryotic cells\nCorrect Answer: D",

            "Question: What is the main function of red blood cells?\nA. Fight infection\nB. Transport oxygen\nC. Clot blood\nD. Produce hormones\nCorrect Answer: B",

            "Question: What macromolecule are enzymes?\nA. Lipids\nB. Carbohydrates\nC. Proteins\nD. Nucleic acids\nCorrect Answer: C",

            "Question: Which organ system controls body activities using hormones?\nA. Nervous system\nB. Digestive system\nC. Endocrine system\nD. Respiratory system\nCorrect Answer: C",

            "Question: What is the process of cell division in somatic cells?\nA. Meiosis\nB. Mitosis\nC. Binary fission\nD. Budding\nCorrect Answer: B",

            "Question: Which part of the plant conducts photosynthesis?\nA. Root\nB. Stem\nC. Leaf\nD. Flower\nCorrect Answer: C",

            "Question: What is the main function of the mitochondria?\nA. Store water\nB. Produce energy\nC. Make proteins\nD. Protect the cell\nCorrect Answer: B",

            "Question: Which biomolecule provides quick energy?\nA. Proteins\nB. Lipids\nC. Carbohydrates\nD. Nucleic acids\nCorrect Answer: C",

            "Question: What is the genetic material in viruses?\nA. Only DNA\nB. Only RNA\nC. Either DNA or RNA\nD. Neither DNA nor RNA\nCorrect Answer: C",

            "Question: What is the main function of the skeletal system?\nA. Pump blood\nB. Protect organs and support the body\nC. Digest food\nD. Produce hormones\nCorrect Answer: B",

            "Question: Which blood cells help fight infections?\nA. Red blood cells\nB. Platelets\nC. White blood cells\nD. Plasma\nCorrect Answer: C",

            "Question: What is the process by which organisms maintain stable internal conditions?\nA. Metabolism\nB. Homeostasis\nC. Evolution\nD. Adaptation\nCorrect Answer: B",

            "Question: Which organ is primarily responsible for filtering blood?\nA. Heart\nB. Liver\nC. Kidney\nD. Lung\nCorrect Answer: C"
        ]
        return bioQuestionBank[random.randint(0, 19)]
    elif(topic == "history"):
        historyQuestionBank = [
            "Question: Who was the first President of the United States?\nA. Thomas Jefferson\nB. Abraham Lincoln\nC. George Washington\nD. John Adams\nCorrect Answer: C",

            "Question: In what year did World War II end?\nA. 1943\nB. 1944\nC. 1945\nD. 1946\nCorrect Answer: C",

            "Question: Which ancient civilization built the pyramids?\nA. Romans\nB. Greeks\nC. Egyptians\nD. Mayans\nCorrect Answer: C",

            "Question: Who was known as the 'Emperor of France' in the early 19th century?\nA. Louis XVI\nB. Napoleon Bonaparte\nC. Charlemagne\nD. Julius Caesar\nCorrect Answer: B",

            "Question: What was the name of the ship that brought the Pilgrims to America in 1620?\nA. Santa Maria\nB. Mayflower\nC. Titanic\nD. Endeavour\nCorrect Answer: B",

            "Question: Which war was fought between the North and South regions of the United States?\nA. World War I\nB. American Revolution\nC. Civil War\nD. War of 1812\nCorrect Answer: C",

            "Question: Who discovered America in 1492?\nA. Ferdinand Magellan\nB. Christopher Columbus\nC. Vasco da Gama\nD. Marco Polo\nCorrect Answer: B",

            "Question: Which document declared the independence of the American colonies from Britain?\nA. Constitution\nB. Bill of Rights\nC. Declaration of Independence\nD. Articles of Confederation\nCorrect Answer: C",

            "Question: Who was the leader of Nazi Germany during World War II?\nA. Joseph Stalin\nB. Adolf Hitler\nC. Benito Mussolini\nD. Winston Churchill\nCorrect Answer: B",

            "Question: What wall fell in 1989, symbolizing the end of the Cold War?\nA. Great Wall of China\nB. Berlin Wall\nC. Hadrian’s Wall\nD. Western Wall\nCorrect Answer: B",

            "Question: Which empire was ruled by Julius Caesar?\nA. Greek Empire\nB. Roman Empire\nC. Ottoman Empire\nD. British Empire\nCorrect Answer: B",

            "Question: What was the Renaissance?\nA. A war\nB. A scientific experiment\nC. A cultural revival in Europe\nD. A political movement\nCorrect Answer: C",

            "Question: Who was the first man to walk on the Moon?\nA. Buzz Aldrin\nB. Yuri Gagarin\nC. Neil Armstrong\nD. Michael Collins\nCorrect Answer: C",

            "Question: Which country was the first to use paper money?\nA. United States\nB. China\nC. India\nD. Egypt\nCorrect Answer: B",

            "Question: What was the main cause of World War I?\nA. The Great Depression\nB. Assassination of Archduke Franz Ferdinand\nC. The Cold War\nD. Industrial Revolution\nCorrect Answer: B",

            "Question: Who was the famous civil rights leader who gave the 'I Have a Dream' speech?\nA. Malcolm X\nB. Martin Luther King Jr.\nC. Rosa Parks\nD. Frederick Douglass\nCorrect Answer: B",

            "Question: Which ancient civilization is known for its democracy in Athens?\nA. Roman\nB. Egyptian\nC. Greek\nD. Persian\nCorrect Answer: C",

            "Question: What was the Cold War primarily between?\nA. USA and Germany\nB. USA and Japan\nC. USA and Soviet Union\nD. Britain and France\nCorrect Answer: C",

            "Question: Who was the British Prime Minister during most of World War II?\nA. Neville Chamberlain\nB. Winston Churchill\nC. Margaret Thatcher\nD. Tony Blair\nCorrect Answer: B",

            "Question: What year did the American Revolution begin?\nA. 1770\nB. 1775\nC. 1783\nD. 1789\nCorrect Answer: B"
        ]
        return historyQuestionBank[random.randint(0, 19)]
    elif(topic == "geography"):
        geographyQuestionBank = [
            "Question: What is the largest continent on Earth?\nA. Africa\nB. Asia\nC. Europe\nD. Antarctica\nCorrect Answer: B",

            "Question: Which ocean is the largest?\nA. Atlantic Ocean\nB. Indian Ocean\nC. Arctic Ocean\nD. Pacific Ocean\nCorrect Answer: D",

            "Question: What is the capital of France?\nA. Berlin\nB. Madrid\nC. Paris\nD. Rome\nCorrect Answer: C",

            "Question: Which country has the largest population in the world?\nA. India\nB. United States\nC. China\nD. Brazil\nCorrect Answer: C",

            "Question: What river is the longest in the world?\nA. Amazon River\nB. Nile River\nC. Mississippi River\nD. Yangtze River\nCorrect Answer: B",

            "Question: Which desert is the largest in the world?\nA. Sahara Desert\nB. Arabian Desert\nC. Gobi Desert\nD. Kalahari Desert\nCorrect Answer: A",

            "Question: What is the capital of Japan?\nA. Kyoto\nB. Osaka\nC. Tokyo\nD. Hiroshima\nCorrect Answer: C",

            "Question: Which continent is the Sahara Desert located on?\nA. Asia\nB. Africa\nC. Australia\nD. South America\nCorrect Answer: B",

            "Question: Which country is known as the Land of the Rising Sun?\nA. China\nB. Thailand\nC. Japan\nD. South Korea\nCorrect Answer: C",

            "Question: What is the smallest continent?\nA. Europe\nB. Antarctica\nC. Australia\nD. South America\nCorrect Answer: C",

            "Question: Which mountain is the tallest in the world?\nA. K2\nB. Mount Everest\nC. Mount Kilimanjaro\nD. Mount Fuji\nCorrect Answer: B",

            "Question: What is the capital of Canada?\nA. Toronto\nB. Vancouver\nC. Ottawa\nD. Montreal\nCorrect Answer: C",

            "Question: Which ocean is located between Africa and Australia?\nA. Atlantic Ocean\nB. Pacific Ocean\nC. Indian Ocean\nD. Southern Ocean\nCorrect Answer: C",

            "Question: What country is both in Europe and Asia?\nA. Egypt\nB. Turkey\nC. Spain\nD. Italy\nCorrect Answer: B",

            "Question: What is the capital of Australia?\nA. Sydney\nB. Melbourne\nC. Canberra\nD. Brisbane\nCorrect Answer: C",

            "Question: Which U.S. state is the largest by area?\nA. Texas\nB. California\nC. Alaska\nD. Montana\nCorrect Answer: C",

            "Question: What is the longest river in the United States?\nA. Mississippi River\nB. Missouri River\nC. Colorado River\nD. Ohio River\nCorrect Answer: B",

            "Question: Which continent has the most countries?\nA. Asia\nB. Europe\nC. Africa\nD. South America\nCorrect Answer: C",

            "Question: What is the capital of Italy?\nA. Venice\nB. Milan\nC. Rome\nD. Naples\nCorrect Answer: C",

            "Question: Which country has the most time zones?\nA. Russia\nB. United States\nC. China\nD. Australia\nCorrect Answer: A"
        ]
        return geographyQuestionBank[random.randint(0, 19)]
    elif(topic == "chemistry"):
        chemistryQuestionBank = [
            "Question: What is the chemical symbol for water?\nA. O2\nB. H2O\nC. CO2\nD. NaCl\nCorrect Answer: B",

            "Question: What is the atomic number of carbon?\nA. 6\nB. 8\nC. 12\nD. 14\nCorrect Answer: A",

            "Question: Which element is a noble gas?\nA. Oxygen\nB. Nitrogen\nC. Neon\nD. Hydrogen\nCorrect Answer: C",

            "Question: What is the pH of a neutral solution?\nA. 0\nB. 7\nC. 14\nD. 10\nCorrect Answer: B",

            "Question: What type of bond involves the sharing of electrons?\nA. Ionic bond\nB. Covalent bond\nC. Metallic bond\nD. Hydrogen bond\nCorrect Answer: B",

            "Question: What is the chemical symbol for sodium?\nA. So\nB. Sd\nC. Na\nD. Sn\nCorrect Answer: C",

            "Question: Which subatomic particle has a positive charge?\nA. Electron\nB. Neutron\nC. Proton\nD. Photon\nCorrect Answer: C",

            "Question: What is the most abundant gas in Earth's atmosphere?\nA. Oxygen\nB. Carbon dioxide\nC. Nitrogen\nD. Hydrogen\nCorrect Answer: C",

            "Question: What is the formula for table salt?\nA. KCl\nB. NaCl\nC. CaCO3\nD. HCl\nCorrect Answer: B",

            "Question: Which state of matter has a definite shape and volume?\nA. Liquid\nB. Gas\nC. Plasma\nD. Solid\nCorrect Answer: D",

            "Question: What is the process of a solid changing directly into a gas called?\nA. Condensation\nB. Sublimation\nC. Evaporation\nD. Freezing\nCorrect Answer: B",

            "Question: Which element has the chemical symbol Fe?\nA. Fluorine\nB. Iron\nC. Francium\nD. Fermium\nCorrect Answer: B",

            "Question: What is the smallest unit of an element?\nA. Molecule\nB. Atom\nC. Compound\nD. Ion\nCorrect Answer: B",

            "Question: Which type of reaction releases energy?\nA. Endothermic\nB. Exothermic\nC. Neutralization\nD. Decomposition\nCorrect Answer: B",

            "Question: What is the chemical symbol for gold?\nA. Go\nB. Au\nC. Ag\nD. Gd\nCorrect Answer: B",

            "Question: What is the main component of natural gas?\nA. Propane\nB. Butane\nC. Methane\nD. Ethane\nCorrect Answer: C",

            "Question: Which acid is found in vinegar?\nA. Citric acid\nB. Sulfuric acid\nC. Acetic acid\nD. Hydrochloric acid\nCorrect Answer: C",

            "Question: What is the molar mass of water (H2O)?\nA. 16 g/mol\nB. 18 g/mol\nC. 20 g/mol\nD. 22 g/mol\nCorrect Answer: B",

            "Question: Which particle has no charge?\nA. Proton\nB. Electron\nC. Neutron\nD. Ion\nCorrect Answer: C",

            "Question: What is the periodic table organized by?\nA. Atomic mass only\nB. Number of neutrons\nC. Atomic number\nD. Chemical bonds\nCorrect Answer: C"
        ]
        return chemistryQuestionBank[random.randint(0, 19)]
    elif(topic == "literature"):
        literatureQuestionBank = [
            "Question: Who wrote 'Romeo and Juliet'?\nA. Charles Dickens\nB. William Shakespeare\nC. Jane Austen\nD. Mark Twain\nCorrect Answer: B",

            "Question: What is the main character’s name in '1984'?\nA. Winston Smith\nB. Holden Caulfield\nC. Jay Gatsby\nD. Harry Potter\nCorrect Answer: A",

            "Question: Who is the author of 'Pride and Prejudice'?\nA. Emily Brontë\nB. Jane Austen\nC. Virginia Woolf\nD. Mary Shelley\nCorrect Answer: B",

            "Question: What is the title of the first Harry Potter book?\nA. The Chamber of Secrets\nB. The Goblet of Fire\nC. The Sorcerer’s Stone\nD. The Half-Blood Prince\nCorrect Answer: C",

            "Question: Who wrote 'The Great Gatsby'?\nA. Ernest Hemingway\nB. F. Scott Fitzgerald\nC. John Steinbeck\nD. William Faulkner\nCorrect Answer: B",

            "Question: In 'To Kill a Mockingbird', who is the narrator?\nA. Atticus Finch\nB. Scout Finch\nC. Jem Finch\nD. Tom Robinson\nCorrect Answer: B",

            "Question: Who wrote 'Moby-Dick'?\nA. Herman Melville\nB. Nathaniel Hawthorne\nC. Edgar Allan Poe\nD. Walt Whitman\nCorrect Answer: A",

            "Question: What is the genre of 'The Hobbit'?\nA. Science fiction\nB. Fantasy\nC. Mystery\nD. Romance\nCorrect Answer: B",

            "Question: Who is the author of 'The Catcher in the Rye'?\nA. J.D. Salinger\nB. George Orwell\nC. Ray Bradbury\nD. Kurt Vonnegut\nCorrect Answer: A",

            "Question: What is the setting of 'Lord of the Flies'?\nA. A city\nB. A desert\nC. An island\nD. A forest\nCorrect Answer: C",

            "Question: Who wrote 'Frankenstein'?\nA. Mary Shelley\nB. Bram Stoker\nC. H.G. Wells\nD. Oscar Wilde\nCorrect Answer: A",

            "Question: In 'The Odyssey', who is the main hero?\nA. Achilles\nB. Odysseus\nC. Hector\nD. Paris\nCorrect Answer: B",

            "Question: Who wrote 'The Scarlet Letter'?\nA. Herman Melville\nB. Nathaniel Hawthorne\nC. Henry James\nD. Mark Twain\nCorrect Answer: B",

            "Question: What type of poem is a haiku?\nA. Narrative poem\nB. Epic poem\nC. Short poem with 17 syllables\nD. Rhyming couplet\nCorrect Answer: C",

            "Question: Who is the author of 'Brave New World'?\nA. Aldous Huxley\nB. George Orwell\nC. Isaac Asimov\nD. H.G. Wells\nCorrect Answer: A",

            "Question: In 'Of Mice and Men', what is Lennie known for?\nA. His intelligence\nB. His strength\nC. His speed\nD. His leadership\nCorrect Answer: B",

            "Question: Who wrote 'The Iliad'?\nA. Sophocles\nB. Homer\nC. Virgil\nD. Plato\nCorrect Answer: B",

            "Question: What is the primary conflict in 'Hamlet'?\nA. Man vs Nature\nB. Man vs Society\nC. Man vs Self\nD. Man vs Machine\nCorrect Answer: C",

            "Question: Who is the author of 'Fahrenheit 451'?\nA. Ray Bradbury\nB. Kurt Vonnegut\nC. George Orwell\nD. Philip K. Dick\nCorrect Answer: A",

            "Question: What is the term for a story's main message?\nA. Plot\nB. Theme\nC. Setting\nD. Conflict\nCorrect Answer: B"
        ]
        return literatureQuestionBank[random.randint(0, 19)]
    elif(topic == "computer science"):
        computerScienceQuestionBank = [
            "Question: What does CPU stand for?\nA. Central Process Unit\nB. Central Processing Unit\nC. Computer Personal Unit\nD. Central Performance Utility\nCorrect Answer: B",

            "Question: Which data structure uses FIFO (First In, First Out)?\nA. Stack\nB. Queue\nC. Tree\nD. Graph\nCorrect Answer: B",

            "Question: What does RAM stand for?\nA. Read Access Memory\nB. Random Access Memory\nC. Run Access Memory\nD. Rapid Action Memory\nCorrect Answer: B",

            "Question: Which programming language is primarily used for web page structure?\nA. Python\nB. HTML\nC. Java\nD. C++\nCorrect Answer: B",

            "Question: What is the time complexity of binary search in a sorted array?\nA. O(n)\nB. O(log n)\nC. O(n^2)\nD. O(1)\nCorrect Answer: B",

            "Question: Which data structure uses LIFO (Last In, First Out)?\nA. Queue\nB. Stack\nC. Linked List\nD. Array\nCorrect Answer: B",

            "Question: What does 'HTTP' stand for?\nA. HyperText Transfer Protocol\nB. HighText Transfer Protocol\nC. Hyper Transfer Text Process\nD. HyperText Transmission Program\nCorrect Answer: A",

            "Question: Which of the following is an operating system?\nA. Microsoft Word\nB. Google Chrome\nC. Windows\nD. Python\nCorrect Answer: C",

            "Question: What is a variable in programming?\nA. A fixed value\nB. A storage location with a name\nC. A type of loop\nD. A hardware component\nCorrect Answer: B",

            "Question: Which keyword is used to define a function in Python?\nA. func\nB. define\nC. def\nD. function\nCorrect Answer: C",

            "Question: What is the main purpose of an algorithm?\nA. To store data\nB. To perform calculations\nC. To provide step-by-step instructions to solve a problem\nD. To compile code\nCorrect Answer: C",

            "Question: Which symbol is used for comments in Python?\nA. //\nB. <!-- -->\nC. #\nD. **\nCorrect Answer: C",

            "Question: What is a loop used for in programming?\nA. To store data\nB. To repeat a block of code\nC. To define variables\nD. To compile programs\nCorrect Answer: B",

            "Question: Which data structure consists of nodes connected by pointers?\nA. Array\nB. Stack\nC. Linked List\nD. Queue\nCorrect Answer: C",

            "Question: What does 'GUI' stand for?\nA. Graphical User Interface\nB. General User Input\nC. Global यूनified Interface\nD. Graphic Utility Integration\nCorrect Answer: A",

            "Question: Which sorting algorithm has the best average-case time complexity?\nA. Bubble Sort\nB. Selection Sort\nC. Quick Sort\nD. Linear Sort\nCorrect Answer: C",

            "Question: What is an IP address used for?\nA. Identifying a device on a network\nB. Storing files\nC. Running programs\nD. Compiling code\nCorrect Answer: A",

            "Question: Which of the following is a high-level programming language?\nA. Assembly\nB. Machine Code\nC. Python\nD. Binary\nCorrect Answer: C",

            "Question: What is debugging?\nA. Writing code\nB. Fixing errors in code\nC. Running code\nD. Compiling code\nCorrect Answer: B",

            "Question: What does 'AI' stand for?\nA. Automated Input\nB. Artificial Intelligence\nC. Advanced Integration\nD. Algorithmic Interface\nCorrect Answer: B"
        ]
        return computerScienceQuestionBank[random.randint(0, 19)]
    
    
def parseQuestion(response):
    lines = response.split("\n")
    question = lines[0]
    options = lines[1:5]
    correct_answer = lines[5].split(":")[1].strip()
    return question, options, correct_answer



def quizCreator(numQuestions, topic):
    quiz = []
    for _ in range(numQuestions):
        response = generateQuizQuestion(topic)
        question, options, correct_answer = parseQuestion(response)
        quiz.append({
            "question": question,
            "options": options,
            "correct_answer": correct_answer
        })
    return quiz


def displayingQuiz():
    numQuestions = int(input("Enter the number of quiz questions: "))
    topic = input("Enter a topic for the quiz questions: ")
    quiz = quizCreator(numQuestions, topic)

    for i, q in enumerate(quiz, start=1):
        print(f"\nQuestion {i}")
        print(q['question'])
        
        for option in q['options']:
            print(f"{option}")
            
        correct_answer = q['correct_answer']
        print(f"Correct Answer: {correct_answer}")
    
if __name__ == "__main__":
    displayingQuiz()


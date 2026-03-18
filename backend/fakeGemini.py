import random

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
            "Question: Who was the first president of the United States?\nA. George Washington\nB. Thomas Jefferson\nC. Abraham Lincoln\nD. John Adams\nCorrect Answer: A"
        ]
        return historyQuestionBank[0]
    elif(topic == "geography"):
        geographyQuestionBank = [
            "Question: What is the capital of France?\nA. Berlin\nB. Madrid\nC. Paris\nD. Rome\nCorrect Answer: C"
        ]
        return geographyQuestionBank[0]
    elif(topic == "chemistry"):
        chemistryQuestionBank = [
            "Question: What is the chemical symbol for water?\nA. H2O\nB. CO2\nC. O2\nD. NaCl\nCorrect Answer: A"
        ]
        return chemistryQuestionBank[0]
    elif(topic == "literature"):
        literatureQuestionBank = [
            "Question: Who wrote 'Romeo and Juliet'?\nA. Charles Dickens\nB. William Shakespeare\nC. Jane Austen\nD. Mark Twain\nCorrect Answer: B"
        ]
        return literatureQuestionBank[0]
    elif(topic == "computer science"):
        computerScienceQuestionBank = [
            "Question: What does CPU stand for?\nA. Central Processing Unit\nB. Computer Personal Unit\nC. Central Performance Unit\nD. Computer Processing Unit\nCorrect Answer: A"
        ]
        return computerScienceQuestionBank[0]
    
if __name__ == "__main__":
    topic = "biology"
    question = generateQuizQuestion(topic)
    print(question)

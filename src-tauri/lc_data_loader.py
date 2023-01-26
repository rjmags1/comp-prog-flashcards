from python_graphql_client import GraphqlClient
from time import sleep
import os

"""
This script creates (if not already present in current directory) 
and writes to 2 large files: an sql script and a .txt file. The .txt file
contains the titles, difficulties, tags, and prompts of all 2547 leetcode
questions (at the time of writing this, 1/25/23). The sql script 
inserts all this data into the sqlite db of this project. 

If the script cannot find a copy of the .txt file in the current
directory, it will ping Leetcode's public API for the information.
Because prompts must be individually queried for, many requests must
be made. To avoid code 429 http responses due to rate-limiting, calls to 
time.sleep() are made intermittently, causing the data fetching step to 
    ------ TAKE ROUGHLY A HALF HOUR. HENCE, THE .txt FILE-------

The sql script will be shipped with the final binary, allowing users
to have ~2500 of the best algorithms questions preloaded onto their
app...
    ----IT IS TITLED 'up.sql', AND SHOULD BE MOVED TO------
    -----THE CORRECT MIGRATIONS FOLDER OR DELETED------
"""

if not os.path.isfile('./lc_data.txt'):
    client = GraphqlClient(endpoint="https://leetcode.com/graphql")

    q_list_query = """
    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
        ) {
            total: totalNum
            questions: data {
                difficulty
                frontendQuestionId: questionFrontendId
                title
                titleSlug
                topicTags {
                    name
                }
            }
        }
    }
    """

    prompt_query = """
    query questionContent($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
            content
            mysqlSchemas
        }
    }
    """

    fetched_qs = 2547
    with open('lc_data.txt', 'w') as f:
        for skip in range(0, fetched_qs, 50):
            q_list_variables = {
                "categorySlug": "",
                "filters": {},
                "limit": min(50, fetched_qs),
                "skip": skip
            }
            data = client.execute(query=q_list_query, variables=q_list_variables)
            questions = data['data']['problemsetQuestionList']['questions']
            for q in questions:
                prompt_variables = { 'titleSlug': q['titleSlug'] }
                prompt, schemas = "", []
                try:
                    data = client.execute(query=prompt_query, variables=prompt_variables)['data']['question']
                    prompt, schemas = data['content'], data['mysqlSchemas']
                except Exception as err:
                    print(f"a prompt fetch failed for question with slug: {q['titleSlug']} due to ", err)
                q['prompt'] = prompt
                q['schemas'] = schemas
                print(
                    q['title'], 
                    q['difficulty'], 
                    q['frontendQuestionId'], 
                    q['topicTags'], 
                    q['schemas'],
                    q['prompt'], 
                    sep="\n", end="\n======================\n", file=f)
                sleep(0.5)
            print(f"loaded {skip + len(questions)} questions")
            if skip + 50 < fetched_qs:
                sleep(30)

def parse_tag_list_string(s):
    tags = []
    _, b, c = s.partition(": '")
    while b:
        tags.append(c[:c.find("'")])
        a, b, c = c.partition(": '")
    return tags

questions, delim = [], "======================\n" 
with open('lc_data.txt', 'r') as f:
    while len(questions) < 2547:
        title = f.readline()[:-1]
        difficulty = f.readline()[:-1]
        num = f.readline()[:-1]
        title = num + '. ' + title
        tags = parse_tag_list_string(f.readline())
        f.readline() # sql schemas for db questions, doing nothing with this for now
        markdown_line, md = f.readline(), []
        while markdown_line != delim:
            md.append(markdown_line)
            markdown_line = f.readline()
        prompt = "".join(md)
        questions.append([title, difficulty, tags, prompt])

topics = (
    ('1', '"Dynamic Programming"', 'null'),
    ('1', '"Math"', 'null'),
    ('1', '"Greedy"', 'null'),
    ('1', '"Graph"', 'null'),
    ('1', '"Design"', 'null'),
    ('1', '"Simulation"', 'null'),
    ('1', '"Backtracking"', 'null'),
    ('1', '"Counting"', 'null'),
    ('1', '"Enumeration"', 'null'),
    ('1', '"Recursion"', 'null'),
    ('1', '"Divide and Conquer"', 'null'),
    ('1', '"Memoization"', 'null'),
    ('1', '"Geometry"', 'null'),
    ('1', '"Number Theory"', 'null'),
    ('1', '"Game Theory"', 'null'),
    ('1', '"Data Stream"', 'null'),
    ('1', '"Combinatorics"', 'null'),
    ('1', '"Randomized"', 'null'),
    ('1', '"Iterator"', 'null'),
    ('1', '"Probability"', 'null'),
    ('2', '"Array"', 'null'),
    ('2', '"String"', 'null'),
    ('2', '"Hash Table"', 'null'),
    ('2', '"Sorting"', 'null'),
    ('2', '"Depth-First Search"', 'null'),
    ('2', '"Breadth-First Search"', 'null'),
    ('2', '"Tree"', 'null'),
    ('2', '"Binary Search"', 'null'),
    ('2', '"Matrix"', 'null'),
    ('2', '"Binary Tree"', 'null'),
    ('2', '"Two Pointers"', 'null'),
    ('2', '"Bit Manipulation"', 'null'),
    ('2', '"Stack"', 'null'),
    ('2', '"Heap (Priority Queue)"', 'null'),
    ('2', '"Prefix Sum"', 'null'),
    ('2', '"Sliding Window"', 'null'),
    ('2', '"Union Find"', 'null'),
    ('2', '"Linked List"', 'null'),
    ('2', '"Ordered Set"', 'null'),
    ('2', '"Monotonic Stack"', 'null'),
    ('2', '"Trie"', 'null'),
    ('2', '"Binary Search Tree"', 'null'),
    ('2', '"Queue"', 'null'),
    ('2', '"Bitmask"', 'null'),
    ('2', '"Segment Tree"', 'null'),
    ('2', '"Topological Sort"', 'null'),
    ('2', '"Hash Function"', 'null'),
    ('2', '"Binary Indexed Tree"', 'null'),
    ('2', '"Monotonic Queue"', 'null'),
    ('2', '"Merge Sort"', 'null'),
    ('2', '"Doubly-Linked List"', 'null'),
    ('2', '"Quickselect"', 'null'),
    ('2', '"Bucket Sort"', 'null'),
    ('2', '"Reservoir Sampling"', 'null'),
    ('2', '"Counting Sort"', 'null'),
    ('2', '"Radix Sort"', 'null'),
    ('2', '"Rejection Sampling"', 'null'),
    ('2', '"Eulerian Circuit"', 'null'),
    ('2', '"Line Sweep"','null')
)
tset = set(map(lambda x: x[1][1:-1], topics))
tids = {t[1][1:-1]: id for id, t in enumerate(topics, start=1)}
num_t = len(tset)
diff_enum = {"Easy": 1, "Medium": 2, "Hard": 3}

with open('up.sql', 'w') as f:
    print('INSERT INTO Source (name) VALUES ("Leetcode");\n', file=f)
    print('INSERT INTO User (username) VALUES ("");\n', file=f)
    print('INSERT INTO Deck (name, user) VALUES ("", 1);\n', file=f)
    print('UPDATE Deck SET size = 2547 WHERE id = 1;', file=f)

    print('INSERT INTO Tag (type, name, content)', file=f)
    print('VALUES', file=f)
    for i, (num, name, null) in enumerate(topics):
        tail = ");\n" if i == num_t - 1 else "),"
        print("(" + num, name, null + tail, sep=', ', file=f)
    for id, (title, diff, tags, prompt) in enumerate(questions, start=1):
        print('INSERT INTO CardFront (prompt, title, card)', file=f) 
        print('VALUES', file=f) 
        prompt = prompt.replace('"', "''")
        print(f'("{prompt}"\n, "{title}", {id});\n', file=f)

        print(f'INSERT INTO CardBack (notes, card) VALUES ("", {id});\n', file=f)

        print('INSERT INTO Card (front, back, difficulty, source)', file=f)
        print('VALUES', file=f)
        print(f'({id}, {id}, {diff_enum[diff]}, {1});\n', file=f)

        print(f'INSERT INTO Card_Deck (card, deck) VALUES ({id}, 1);', file=f)

        tags = list(filter(lambda t: t in tset, tags))
        if tags:
            print(f'INSERT INTO Card_Tag (card, tag) VALUES', file=f)
            for i, tag in enumerate(tags):
                tail = '),' if i < len(tags) - 1 else ');\n'
                print(f'({id}, {tids[tag]}' + tail, file=f)
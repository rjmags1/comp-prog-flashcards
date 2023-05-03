INSERT INTO Source (name) VALUES ("Leetcode");

INSERT INTO Deck (name, user) VALUES ("devDeck", 1);

UPDATE Deck SET size = 2547 WHERE id = 1;
INSERT INTO Tag (type, name, content)
VALUES
(1, "Dynamic Programming", null),
(1, "Math", null),
(1, "Greedy", null),
(1, "Graph", null),
(1, "Design", null),
(1, "Simulation", null),
(1, "Backtracking", null),
(1, "Counting", null),
(1, "Enumeration", null),
(1, "Recursion", null),
(1, "Divide and Conquer", null),
(1, "Memoization", null),
(1, "Geometry", null),
(1, "Number Theory", null),
(1, "Game Theory", null),
(1, "Data Stream", null),
(1, "Combinatorics", null),
(1, "Randomized", null),
(1, "Iterator", null),
(1, "Probability", null),
(2, "Array", null),
(2, "String", null),
(2, "Hash Table", null),
(2, "Sorting", null),
(2, "Depth-First Search", null),
(2, "Breadth-First Search", null),
(2, "Tree", null),
(2, "Binary Search", null),
(2, "Matrix", null),
(2, "Binary Tree", null),
(2, "Two Pointers", null),
(2, "Bit Manipulation", null),
(2, "Stack", null),
(2, "Heap (Priority Queue)", null),
(2, "Prefix Sum", null),
(2, "Sliding Window", null),
(2, "Union Find", null),
(2, "Linked List", null),
(2, "Ordered Set", null),
(2, "Monotonic Stack", null),
(2, "Trie", null),
(2, "Binary Search Tree", null),
(2, "Queue", null),
(2, "Bitmask", null),
(2, "Segment Tree", null),
(2, "Topological Sort", null),
(2, "Hash Function", null),
(2, "Binary Indexed Tree", null),
(2, "Monotonic Queue", null),
(2, "Merge Sort", null),
(2, "Doubly-Linked List", null),
(2, "Quickselect", null),
(2, "Bucket Sort", null),
(2, "Reservoir Sampling", null),
(2, "Counting Sort", null),
(2, "Radix Sort", null),
(2, "Rejection Sampling", null),
(2, "Eulerian Circuit", null),
(2, "Line Sweep", null);

INSERT INTO CardFront (prompt, title, card)
VALUES
("<p>Given an array of integers <code>nums</code>&nbsp;and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>

<p>You may assume that each input would have <strong><em>exactly</em> one solution</strong>, and you may not use the <em>same</em> element twice.</p>

<p>You can return the answer in any order.</p>

<p>&nbsp;</p>
<p><strong class=''example''>Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [2,7,11,15], target = 9
<strong>Output:</strong> [0,1]
<strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
</pre>

<p><strong class=''example''>Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [3,2,4], target = 6
<strong>Output:</strong> [1,2]
</pre>

<p><strong class=''example''>Example 3:</strong></p>

<pre>
<strong>Input:</strong> nums = [3,3], target = 6
<strong>Output:</strong> [0,1]
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>
	<li><strong>Only one valid answer exists.</strong></li>
</ul>

<p>&nbsp;</p>
<strong>Follow-up:&nbsp;</strong>Can you come up with an algorithm that is less than&nbsp;<code>O(n<sup>2</sup>)&nbsp;</code>time complexity?
"
, "1. Two Sum", 1);

INSERT INTO CardBack (notes, card) VALUES ("", 1);

INSERT INTO Card (front, back, difficulty, source, shipped)
VALUES
(1, 1, 1, 1, TRUE);

INSERT INTO Card_Deck (card, deck) VALUES (1, 1);
INSERT INTO Card_Tag (card, tag) VALUES
(1, 21),
(1, 23);

INSERT INTO CardFront (prompt, title, card)
VALUES
("<p>You are given two <strong>non-empty</strong> linked lists representing two non-negative integers. The digits are stored in <strong>reverse order</strong>, and each of their nodes contains a single digit. Add the two numbers and return the sum&nbsp;as a linked list.</p>

<p>You may assume the two numbers do not contain any leading zero, except the number 0 itself.</p>

<p>&nbsp;</p>
<p><strong class=''example''>Example 1:</strong></p>
<img alt='''' src=''https://assets.leetcode.com/uploads/2020/10/02/addtwonumber1.jpg'' style=''width: 483px; height: 342px;'' />
<pre>
<strong>Input:</strong> l1 = [2,4,3], l2 = [5,6,4]
<strong>Output:</strong> [7,0,8]
<strong>Explanation:</strong> 342 + 465 = 807.
</pre>

<p><strong class=''example''>Example 2:</strong></p>

<pre>
<strong>Input:</strong> l1 = [0], l2 = [0]
<strong>Output:</strong> [0]
</pre>

<p><strong class=''example''>Example 3:</strong></p>

<pre>
<strong>Input:</strong> l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
<strong>Output:</strong> [8,9,9,9,0,0,0,1]
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li>The number of nodes in each linked list is in the range <code>[1, 100]</code>.</li>
	<li><code>0 &lt;= Node.val &lt;= 9</code></li>
	<li>It is guaranteed that the list represents a number that does not have leading zeros.</li>
</ul>

"
, "2. Add Two Numbers", 2);

INSERT INTO CardBack (notes, card) VALUES ("", 2);

INSERT INTO Card (front, back, difficulty, source, shipped)
VALUES
(2, 2, 2, 1, TRUE);

INSERT INTO Card_Deck (card, deck) VALUES (2, 1);
INSERT INTO Card_Tag (card, tag) VALUES
(2, 38),
(2, 2),
(2, 10);

INSERT INTO CardFront (prompt, title, card)
VALUES
("<p>Given a string <code>s</code>, find the length of the <strong>longest</strong> <span data-keyword=''substring-nonempty''><strong>substring</strong></span> without repeating characters.</p>

<p>&nbsp;</p>
<p><strong class=''example''>Example 1:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;abcabcbb&quot;
<strong>Output:</strong> 3
<strong>Explanation:</strong> The answer is &quot;abc&quot;, with the length of 3.
</pre>

<p><strong class=''example''>Example 2:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;bbbbb&quot;
<strong>Output:</strong> 1
<strong>Explanation:</strong> The answer is &quot;b&quot;, with the length of 1.
</pre>

<p><strong class=''example''>Example 3:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;pwwkew&quot;
<strong>Output:</strong> 3
<strong>Explanation:</strong> The answer is &quot;wke&quot;, with the length of 3.
Notice that the answer must be a substring, &quot;pwke&quot; is a subsequence and not a substring.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>0 &lt;= s.length &lt;= 5 * 10<sup>4</sup></code></li>
	<li><code>s</code> consists of English letters, digits, symbols and spaces.</li>
</ul>

"
, "3. Longest Substring Without Repeating Characters", 3);

INSERT INTO CardBack (notes, card) VALUES ("", 3);

INSERT INTO Card (front, back, difficulty, source, shipped)
VALUES
(3, 3, 2, 1, TRUE);

INSERT INTO Card_Deck (card, deck) VALUES (3, 1);
INSERT INTO Card_Tag (card, tag) VALUES
(3, 23),
(3, 22),
(3, 36);

INSERT INTO CardFront (prompt, title, card)
VALUES
("<p>Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return <strong>the median</strong> of the two sorted arrays.</p>

<p>The overall run time complexity should be <code>O(log (m+n))</code>.</p>

<p>&nbsp;</p>
<p><strong class=''example''>Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums1 = [1,3], nums2 = [2]
<strong>Output:</strong> 2.00000
<strong>Explanation:</strong> merged array = [1,2,3] and median is 2.
</pre>

<p><strong class=''example''>Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums1 = [1,2], nums2 = [3,4]
<strong>Output:</strong> 2.50000
<strong>Explanation:</strong> merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>nums1.length == m</code></li>
	<li><code>nums2.length == n</code></li>
	<li><code>0 &lt;= m &lt;= 1000</code></li>
	<li><code>0 &lt;= n &lt;= 1000</code></li>
	<li><code>1 &lt;= m + n &lt;= 2000</code></li>
	<li><code>-10<sup>6</sup> &lt;= nums1[i], nums2[i] &lt;= 10<sup>6</sup></code></li>
</ul>

"
, "4. Median of Two Sorted Arrays", 4);

INSERT INTO CardBack (notes, card) VALUES ("", 4);

INSERT INTO Card (front, back, difficulty, source, shipped)
VALUES
(4, 4, 3, 1, TRUE);

INSERT INTO Card_Deck (card, deck) VALUES (4, 1);
INSERT INTO Card_Tag (card, tag) VALUES
(4, 21),
(4, 28),
(4, 11);

INSERT INTO CardFront (prompt, title, card)
VALUES
("<p>Given a string <code>s</code>, return <em>the longest</em> <span data-keyword=''palindromic-string''><em>palindromic</em></span> <span data-keyword=''substring-nonempty''><em>substring</em></span> in <code>s</code>.</p>

<p>&nbsp;</p>
<p><strong class=''example''>Example 1:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;babad&quot;
<strong>Output:</strong> &quot;bab&quot;
<strong>Explanation:</strong> &quot;aba&quot; is also a valid answer.
</pre>

<p><strong class=''example''>Example 2:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;cbbd&quot;
<strong>Output:</strong> &quot;bb&quot;
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 1000</code></li>
	<li><code>s</code> consist of only digits and English letters.</li>
</ul>

"
, "5. Longest Palindromic Substring", 5);

INSERT INTO CardBack (notes, card) VALUES ("", 5);

INSERT INTO Card (front, back, difficulty, source, shipped)
VALUES
(5, 5, 2, 1, TRUE);

INSERT INTO Card_Deck (card, deck) VALUES (5, 1);
INSERT INTO Card_Tag (card, tag) VALUES
(5, 22),
(5, 1);

INSERT INTO CardFront (prompt, title, card)
VALUES
("<p>The string <code>&quot;PAYPALISHIRING&quot;</code> is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)</p>

<pre>
P   A   H   N
A P L S I I G
Y   I   R
</pre>

<p>And then read line by line: <code>&quot;PAHNAPLSIIGYIR&quot;</code></p>

<p>Write the code that will take a string and make this conversion given a number of rows:</p>

<pre>
string convert(string s, int numRows);
</pre>

<p>&nbsp;</p>
<p><strong class=''example''>Example 1:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;PAYPALISHIRING&quot;, numRows = 3
<strong>Output:</strong> &quot;PAHNAPLSIIGYIR&quot;
</pre>

<p><strong class=''example''>Example 2:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;PAYPALISHIRING&quot;, numRows = 4
<strong>Output:</strong> &quot;PINALSIGYAHRPI&quot;
<strong>Explanation:</strong>
P     I    N
A   L S  I G
Y A   H R
P     I
</pre>

<p><strong class=''example''>Example 3:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;A&quot;, numRows = 1
<strong>Output:</strong> &quot;A&quot;
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 1000</code></li>
	<li><code>s</code> consists of English letters (lower-case and upper-case), <code>&#39;,&#39;</code> and <code>&#39;.&#39;</code>.</li>
	<li><code>1 &lt;= numRows &lt;= 1000</code></li>
</ul>

"
, "6. Zigzag Conversion", 6);

INSERT INTO CardBack (notes, card) VALUES ("", 6);

INSERT INTO Card (front, back, difficulty, source, shipped)
VALUES
(6, 6, 2, 1, TRUE);

INSERT INTO Card_Deck (card, deck) VALUES (6, 1);
INSERT INTO Card_Tag (card, tag) VALUES
(6, 22);

INSERT INTO CardFront (prompt, title, card)
VALUES
("<p>Given a signed 32-bit integer <code>x</code>, return <code>x</code><em> with its digits reversed</em>. If reversing <code>x</code> causes the value to go outside the signed 32-bit integer range <code>[-2<sup>31</sup>, 2<sup>31</sup> - 1]</code>, then return <code>0</code>.</p>

<p><strong>Assume the environment does not allow you to store 64-bit integers (signed or unsigned).</strong></p>

<p>&nbsp;</p>
<p><strong class=''example''>Example 1:</strong></p>

<pre>
<strong>Input:</strong> x = 123
<strong>Output:</strong> 321
</pre>

<p><strong class=''example''>Example 2:</strong></p>

<pre>
<strong>Input:</strong> x = -123
<strong>Output:</strong> -321
</pre>

<p><strong class=''example''>Example 3:</strong></p>

<pre>
<strong>Input:</strong> x = 120
<strong>Output:</strong> 21
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>-2<sup>31</sup> &lt;= x &lt;= 2<sup>31</sup> - 1</code></li>
</ul>

"
, "7. Reverse Integer", 7);

INSERT INTO CardBack (notes, card) VALUES ("", 7);

INSERT INTO Card (front, back, difficulty, source, shipped)
VALUES
(7, 7, 2, 1, TRUE);

INSERT INTO Card_Deck (card, deck) VALUES (7, 1);
INSERT INTO Card_Tag (card, tag) VALUES
(7, 2);

INSERT INTO CardFront (prompt, title, card)
VALUES
("<p>Implement the <code>myAtoi(string s)</code> function, which converts a string to a 32-bit signed integer (similar to C/C++&#39;s <code>atoi</code> function).</p>

<p>The algorithm for <code>myAtoi(string s)</code> is as follows:</p>

<ol>
	<li>Read in and ignore any leading whitespace.</li>
	<li>Check if the next character (if not already at the end of the string) is <code>&#39;-&#39;</code> or <code>&#39;+&#39;</code>. Read this character in if it is either. This determines if the final result is negative or positive respectively. Assume the result is positive if neither is present.</li>
	<li>Read in next the characters until the next non-digit character or the end of the input is reached. The rest of the string is ignored.</li>
	<li>Convert these digits into an integer (i.e. <code>&quot;123&quot; -&gt; 123</code>, <code>&quot;0032&quot; -&gt; 32</code>). If no digits were read, then the integer is <code>0</code>. Change the sign as necessary (from step 2).</li>
	<li>If the integer is out of the 32-bit signed integer range <code>[-2<sup>31</sup>, 2<sup>31</sup> - 1]</code>, then clamp the integer so that it remains in the range. Specifically, integers less than <code>-2<sup>31</sup></code> should be clamped to <code>-2<sup>31</sup></code>, and integers greater than <code>2<sup>31</sup> - 1</code> should be clamped to <code>2<sup>31</sup> - 1</code>.</li>
	<li>Return the integer as the final result.</li>
</ol>

<p><strong>Note:</strong></p>

<ul>
	<li>Only the space character <code>&#39; &#39;</code> is considered a whitespace character.</li>
	<li><strong>Do not ignore</strong> any characters other than the leading whitespace or the rest of the string after the digits.</li>
</ul>

<p>&nbsp;</p>
<p><strong class=''example''>Example 1:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;42&quot;
<strong>Output:</strong> 42
<strong>Explanation:</strong> The underlined characters are what is read in, the caret is the current reader position.
Step 1: &quot;42&quot; (no characters read because there is no leading whitespace)
         ^
Step 2: &quot;42&quot; (no characters read because there is neither a &#39;-&#39; nor &#39;+&#39;)
         ^
Step 3: &quot;<u>42</u>&quot; (&quot;42&quot; is read in)
           ^
The parsed integer is 42.
Since 42 is in the range [-2<sup>31</sup>, 2<sup>31</sup> - 1], the final result is 42.
</pre>

<p><strong class=''example''>Example 2:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;   -42&quot;
<strong>Output:</strong> -42
<strong>Explanation:</strong>
Step 1: &quot;<u>   </u>-42&quot; (leading whitespace is read and ignored)
            ^
Step 2: &quot;   <u>-</u>42&quot; (&#39;-&#39; is read, so the result should be negative)
             ^
Step 3: &quot;   -<u>42</u>&quot; (&quot;42&quot; is read in)
               ^
The parsed integer is -42.
Since -42 is in the range [-2<sup>31</sup>, 2<sup>31</sup> - 1], the final result is -42.
</pre>

<p><strong class=''example''>Example 3:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;4193 with words&quot;
<strong>Output:</strong> 4193
<strong>Explanation:</strong>
Step 1: &quot;4193 with words&quot; (no characters read because there is no leading whitespace)
         ^
Step 2: &quot;4193 with words&quot; (no characters read because there is neither a &#39;-&#39; nor &#39;+&#39;)
         ^
Step 3: &quot;<u>4193</u> with words&quot; (&quot;4193&quot; is read in; reading stops because the next character is a non-digit)
             ^
The parsed integer is 4193.
Since 4193 is in the range [-2<sup>31</sup>, 2<sup>31</sup> - 1], the final result is 4193.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>0 &lt;= s.length &lt;= 200</code></li>
	<li><code>s</code> consists of English letters (lower-case and upper-case), digits (<code>0-9</code>), <code>&#39; &#39;</code>, <code>&#39;+&#39;</code>, <code>&#39;-&#39;</code>, and <code>&#39;.&#39;</code>.</li>
</ul>

"
, "8. String to Integer (atoi)", 8);

INSERT INTO CardBack (notes, card) VALUES ("", 8);

INSERT INTO Card (front, back, difficulty, source, shipped)
VALUES
(8, 8, 2, 1, TRUE);

INSERT INTO Card_Deck (card, deck) VALUES (8, 1);
INSERT INTO Card_Tag (card, tag) VALUES
(8, 22);

INSERT INTO CardFront (prompt, title, card)
VALUES
("<p>Given an integer <code>x</code>, return <code>true</code><em> if </em><code>x</code><em> is a </em><span data-keyword=''palindrome-integer''><em><strong>palindrome</strong></em></span><em>, and </em><code>false</code><em> otherwise</em>.</p>

<p>&nbsp;</p>
<p><strong class=''example''>Example 1:</strong></p>

<pre>
<strong>Input:</strong> x = 121
<strong>Output:</strong> true
<strong>Explanation:</strong> 121 reads as 121 from left to right and from right to left.
</pre>

<p><strong class=''example''>Example 2:</strong></p>

<pre>
<strong>Input:</strong> x = -121
<strong>Output:</strong> false
<strong>Explanation:</strong> From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
</pre>

<p><strong class=''example''>Example 3:</strong></p>

<pre>
<strong>Input:</strong> x = 10
<strong>Output:</strong> false
<strong>Explanation:</strong> Reads 01 from right to left. Therefore it is not a palindrome.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>-2<sup>31</sup>&nbsp;&lt;= x &lt;= 2<sup>31</sup>&nbsp;- 1</code></li>
</ul>

<p>&nbsp;</p>
<strong>Follow up:</strong> Could you solve it without converting the integer to a string?
"
, "9. Palindrome Number", 9);

INSERT INTO CardBack (notes, card) VALUES ("", 9);

INSERT INTO Card (front, back, difficulty, source, shipped)
VALUES
(9, 9, 1, 1, TRUE);

INSERT INTO Card_Deck (card, deck) VALUES (9, 1);
INSERT INTO Card_Tag (card, tag) VALUES
(9, 2);

INSERT INTO CardFront (prompt, title, card)
VALUES
("<p>Given an input string <code>s</code>&nbsp;and a pattern <code>p</code>, implement regular expression matching with support for <code>&#39;.&#39;</code> and <code>&#39;*&#39;</code> where:</p>

<ul>
	<li><code>&#39;.&#39;</code> Matches any single character.​​​​</li>
	<li><code>&#39;*&#39;</code> Matches zero or more of the preceding element.</li>
</ul>

<p>The matching should cover the <strong>entire</strong> input string (not partial).</p>

<p>&nbsp;</p>
<p><strong class=''example''>Example 1:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;aa&quot;, p = &quot;a&quot;
<strong>Output:</strong> false
<strong>Explanation:</strong> &quot;a&quot; does not match the entire string &quot;aa&quot;.
</pre>

<p><strong class=''example''>Example 2:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;aa&quot;, p = &quot;a*&quot;
<strong>Output:</strong> true
<strong>Explanation:</strong> &#39;*&#39; means zero or more of the preceding element, &#39;a&#39;. Therefore, by repeating &#39;a&#39; once, it becomes &quot;aa&quot;.
</pre>

<p><strong class=''example''>Example 3:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;ab&quot;, p = &quot;.*&quot;
<strong>Output:</strong> true
<strong>Explanation:</strong> &quot;.*&quot; means &quot;zero or more (*) of any character (.)&quot;.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= s.length&nbsp;&lt;= 20</code></li>
	<li><code>1 &lt;= p.length&nbsp;&lt;= 30</code></li>
	<li><code>s</code> contains only lowercase English letters.</li>
	<li><code>p</code> contains only lowercase English letters, <code>&#39;.&#39;</code>, and&nbsp;<code>&#39;*&#39;</code>.</li>
	<li>It is guaranteed for each appearance of the character <code>&#39;*&#39;</code>, there will be a previous valid character to match.</li>
</ul>

"
, "10. Regular Expression Matching", 10);

INSERT INTO CardBack (notes, card) VALUES ("", 10);

INSERT INTO Card (front, back, difficulty, source, shipped)
VALUES
(10, 10, 3, 1, TRUE);

INSERT INTO Card_Deck (card, deck) VALUES (10, 1);
INSERT INTO Card_Tag (card, tag) VALUES
(10, 22),
(10, 1),
(10, 10);
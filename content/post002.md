---
title: My Computer Wasn't Slow. My Code Was.
date: 2026-11-10
tags: [programming, python, rust, linux]
---

<figure class="post-cover">
  <img src="./static/images/post002.jpg" alt="A laptop screen filled with code in a dark room">
  <figcaption>The script that started it.</figcaption>
</figure>

_I wrote a script to do something boring. It was supposed to take a second._

It took long enough for me to get up, make coffee, come back, and assume it had crashed.

The script was not complicated. It read a folder of logs, pulled out a few fields, counted things, and wrote a CSV. The kind of thing you write once and forget. I wrote it in Python because Python is what I reach for when the problem is small and the answer should be quick.

The first run was quick.

The second one wasn't.

---

## The Usual Suspects

At first, I blamed the laptop.

The fan was spinning. Windows was doing something in the background. Probably updates. Probably the antivirus. Probably both, taking turns. I closed everything, opened Task Manager, and watched a list of processes I did not recognise use memory I did not have.

Then I ran the script again.

Same result.

So I blamed Python. Everyone says Python is slow. I had read that sentence a hundred times. I had repeated it myself. But I had never actually watched it happen to me. Not like this. Not with a program so small that I could hold the entire thing in my head.

That was the annoying part. The script was not doing anything clever. It was doing something deeply unremarkable, very slowly.

---

## The Most Boring Thing a Programmer Can Do

I put timers around the parts.

Not around the whole script. Around the pieces. Reading the files. Parsing the lines. Counting the results. Writing the output.

```python
import time

start = time.perf_counter()
rows = read_files(folder)
print("read", time.perf_counter() - start)

start = time.perf_counter()
result = process(rows)
print("process", time.perf_counter() - start)
```

The files were fine. Reading them was fine. The output was fine.

The processing loop was the problem.

Inside that loop were a dozen small things. A string split. A regular expression. A dictionary lookup. A list append. A little bit of cleaning. None of them looked expensive. Each one was cheap. That was the trick.

There were just millions of them.

A Python loop is like asking a very patient assistant to do one thing at a time. It is wonderful when there are ten things. It is less wonderful when there are four million. The assistant is not lazy. The assistant is just doing exactly what you asked, one interpreted step at a time, and you asked for a lot.

The progress bar was not helping. It had the confidence of a progress bar that had no idea how much work was left. It sat at 40 percent for so long that I started wondering whether the number after the decimal point was moving at all.

That was the moment I stopped guessing.

---

## So I Rewrote It in Rust

I had been meaning to learn Rust for a while. This was a good excuse. Not a good reason, but a good excuse.

The first version did not compile.

Then the second version did not compile.

The borrow checker had opinions. `String` and `&str` were not the same thing, apparently. I was moving values when I should have been borrowing them, borrowing them when I should have been cloning them, and cloning them when I should have been asking a more basic question about what the program actually needed to own.

Then it compiled.

Then it ran.

The output was identical. The time was not.

It finished before I could switch windows. I genuinely thought it had failed silently. I checked the row count twice. Then I checked it again. The CSV was there. The numbers were right. The program had simply done the work and left without making a scene.

Rust did not make me smarter. It made me pay for things up front. It made me think about allocation, ownership, and copying before the program ran, instead of discovering the cost later in a progress bar that refused to move. The Python version was easy to write and expensive to run. The Rust version was annoying to write and cheap to run.

That trade-off is the whole story.

But here is the part I did not expect: the Rust rewrite made me better at Python.

Once I understood where the time was going, I could see the dumb things in the original. I could have compiled the regular expression once instead of rebuilding it inside the loop. I could have used a set instead of repeatedly searching a list. I could have stopped re-reading the same file for every pass. The language was not the only problem. My algorithm was doing unnecessary work, and Python was polite enough to do all of it.

Rust did not replace Python. It gave me a second opinion.

---

## Then Windows

Around the same time, I moved my PC to Fedora.

That was not because of the script. It was because I was tired of the computer feeling like it was doing something else while I was trying to work. The fan noise. The updates at the wrong time. The settings app that hides the setting. The feeling that the machine had a schedule and I was not invited to it.

Fedora did not magically make the laptop faster. The hardware was the same. The CPU was the same. The RAM was the same.

But the machine became quieter.

I could see what was running. I could kill it. I could decide what started at boot. The feedback loop got shorter. The same laptop felt like mine again.

It was the same lesson as the script, just at a different layer. The slow thing was not always the thing I was looking at. Sometimes it was the language. Sometimes it was the operating system. Sometimes it was the fourteen browser tabs and the thing I had forgotten to close three days ago.

The only way to know is to measure.

---

## The Boring Superpower

We talk about programming like it is about writing code. A lot of it is actually about asking better questions:

- Where is the time going?
- Which part is actually slow?
- What am I doing that I do not need to do?
- Is this the right tool, or just the one I know?

The stopwatch is the most underrated tool in software. It turns "my computer is slow" into "this function is slow." It turns "this function is slow" into "this loop is doing four million regular-expression searches." It turns a vague feeling into a number you can do something about.

That is not a language war. That is just looking.

The boring version of this story is that Python is slow. The more interesting version is that Python was not the villain. It was a mirror. It showed me exactly how much work I had asked for, and it refused to hide the cost.

Rust did not fix that. Measuring did.

---

## Try It Yourself

Write a deliberately boring script. Process a large CSV. Count the words in a book. Scan a folder of logs. Something small enough that you can understand every line.

Time the whole thing. Then time each part. Then change one thing and measure again.

If you want to try Rust, do not rewrite everything. Rewrite the hot loop. Compare the results. Keep the version that makes sense for the job. The point is not to convert. The point is to see.

And if your computer feels slow, open the task manager before you open a shopping tab. You might find the culprit. It might be an update. It might be a background service. It might be the code. It might be you.

The most interesting things in programming are usually hiding inside the most boring ones.

_I did not move to Rust because Python is bad. I moved because I finally asked where the time went._

_Fedora was the same lesson applied to the whole machine._

_— Keep measuring._

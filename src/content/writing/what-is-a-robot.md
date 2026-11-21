---
title: "What is a robot?"
description: "A robot vacuum, a factory arm, and a washing machine all follow instructions. Which ones count as robots, and why?"
date: 2026-11-21
category: "Back to basic"
tags: ["Robotics"]
---

When we talk about robots, I bet a lot of you guys would immediately think of those scary, human-like machines from *The Terminator* or some other sci-fi movie. Or maybe you imagine a future where we all live on giant spaceships, sitting around and being served by robots all day, just like in *WALL·E*. Or perhaps something more fun and colourful, like the futuristic world in *Meet the Robinsons* (honestly, I wouldn't mind living there!).

<figure>
  <img src="../../images/what-is-a-robot/meet-the-robinsons-city.jpg" width="1440" height="617" alt="Lewis and Wilbur ride in a red flying time machine past curved towers and a silver dome under a bright blue sky.">
  <figcaption>A ride through the city of the future in <cite>Meet the Robinsons</cite> (2007). Image © Disney. <a href="https://movies.disney.com/meet-the-robinsons">Disney Movies</a></figcaption>
</figure>

But here's the funny thing. We don't actually have to wait for some faraway sci-fi future to live with robots. Surprisingly enough, we've already been living alongside robots for years!

If you have a robot vacuum at home, congratulations, you already have your own little robot assistant. And even if you don't, you've probably seen robotic arms working in factories, robots delivering food in restaurants, or those cute little delivery robots roaming around. Nothing particularly futuristic about those anymore, right?

But that brings up a question I've always found pretty interesting. **What actually makes something a robot?**

Is a robot vacuum a robot? Obviously, yes, it's literally in the name. What about a dishwasher? It can clean dishes all by itself, adjust its washing cycle and even detect how dirty the water is. Or a washing machine? You press a button, and it does everything for you. So... are those robots too?

## Okay, so what actually counts as a robot?

<section class="robot-activity" aria-labelledby="robot-quiz-title">
  <h3 id="robot-quiz-title">Is it a robot?</h3>
  <p class="activity-hint">Pick yes or no for each machine, then check your guesses.</p>
  <form id="robot-quiz">
    <div class="robot-cards">
      <fieldset data-answer="robot">
        <legend>Robot vacuum</legend>
        <img src="../../images/what-is-a-robot/vacuum.svg" width="220" height="150" alt="">
        <div class="robot-choices">
          <label><input type="radio" name="guess-vacuum" value="robot" required><span>Yes</span></label>
          <label><input type="radio" name="guess-vacuum" value="appliance" required><span>No</span></label>
        </div>
        <p class="guess-result" hidden></p>
      </fieldset>
      <fieldset data-answer="appliance">
        <legend>Dishwasher</legend>
        <img src="../../images/what-is-a-robot/dishwasher.svg" width="220" height="150" alt="">
        <div class="robot-choices">
          <label><input type="radio" name="guess-dishwasher" value="robot" required><span>Yes</span></label>
          <label><input type="radio" name="guess-dishwasher" value="appliance" required><span>No</span></label>
        </div>
        <p class="guess-result" hidden></p>
      </fieldset>
      <fieldset data-answer="robot">
        <legend>Factory arm</legend>
        <img src="../../images/what-is-a-robot/arm.svg" width="220" height="150" alt="">
        <div class="robot-choices">
          <label><input type="radio" name="guess-arm" value="robot" required><span>Yes</span></label>
          <label><input type="radio" name="guess-arm" value="appliance" required><span>No</span></label>
        </div>
        <p class="guess-result" hidden></p>
      </fieldset>
    </div>
    <div class="quiz-actions" hidden>
      <button type="submit" class="robot-button">Check my guesses</button>
      <button type="reset" class="robot-button secondary" hidden>Try again</button>
      <output aria-live="polite"></output>
    </div>
  </form>
  <noscript><details><summary>Reveal the answers</summary>Robot vacuum — yes. Dishwasher — generally no. Factory arm — yes.</details></noscript>
</section>

We tend to imagine robots as intelligent machines that can think, talk and do all sorts of complicated things. But in reality, a robot doesn't necessarily have to be intelligent at all. Broadly speaking, a robot is a programmable physical machine that can carry out actions with some degree of autonomy, usually by moving around or manipulating things in the physical world.

Sounds a bit fancy, doesn't it? Basically, a robot is a machine that can carry out physical tasks without us having to control every single movement.

And here's something that surprised me when I first started learning about robotics: **a robot doesn't even need AI to be a robot!** A factory robotic arm, for example, might simply repeat the same pick-and-place movement thousands of times a day. It doesn't necessarily understand what it's picking up, or why. It just follows its programmed instructions. Yet, it's still a robot.

Meanwhile, a dishwasher might have sensors, automatic programs and some pretty clever control systems. But we wouldn't normally classify a conventional dishwasher as a robot. It's an automated appliance.

So, not every automated machine is a robot, and not every robot is intelligent. The boundary can be a little fuzzy, but I think that's what makes this question so interesting.

## Sense, Think, Act. That's it?

Now that we have a rough idea of what a robot is, let's talk about how one actually works. A really common way to understand robot behaviour is through something called the **Sense → Think → Act** cycle. Don't worry, it's nowhere near as complicated as it sounds.

1. **Sense:** The robot gathers information about its surroundings using sensors, like cameras, distance sensors or touch sensors.
2. **Think:** The robot processes that information and decides what to do next. This could be something as simple as following a predefined rule, or something much more complicated involving AI.
3. **Act:** The robot physically does something, like moving its wheels, turning its arm or picking up an object.

And then it repeats!

<section class="robot-activity" id="vacuum-cycle" data-stage="sense" aria-labelledby="vacuum-cycle-title">
  <h3 id="vacuum-cycle-title">Sense → Think → Act</h3>
  <p class="activity-hint">Follow the vacuum as it reaches the living room wall.</p>
  <svg class="room-plan" viewBox="0 0 500 220" aria-hidden="true">
    <defs>
      <pattern id="floorboards" width="96" height="44" patternUnits="userSpaceOnUse">
        <rect width="96" height="44" fill="#f6f4e9"/>
        <path d="M0 0h96M0 22h96M16 0v22m48 0v22" fill="none" stroke="#e1dfd2"/>
      </pattern>
      <pattern id="rug-weave" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#d8e1d2"/>
        <path d="m0 6 6-6" stroke="#cbd7c5" fill="none"/>
      </pattern>
    </defs>
    <rect x="10" y="9" width="480" height="202" rx="3" fill="url(#floorboards)" stroke="#758272" stroke-width="4"/>
    <rect x="37" y="53" width="195" height="113" rx="2" fill="url(#rug-weave)" stroke="#a3b69f"/>
    <rect x="44" y="60" width="181" height="99" rx="1" fill="none" stroke="#a3b69f"/>
    <g fill="#94aa98" stroke="#4a6455" stroke-width="1.7">
      <rect x="64" y="18" width="138" height="41" rx="5"/>
      <rect x="73" y="27" width="59" height="28" rx="4"/><rect x="133" y="27" width="59" height="28" rx="4"/>
      <rect x="62" y="25" width="10" height="34" rx="3"/><rect x="193" y="25" width="10" height="34" rx="3"/>
    </g>
    <g fill="#c5a57f" stroke="#7b684f" stroke-width="1.7">
      <rect x="100" y="88" width="62" height="37" rx="13"/>
      <circle cx="143" cy="104" r="6" fill="#f0eee4"/>
    </g>
    <path d="M260 148h182" stroke="#899786" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round"/>
    <g class="turn-plan" fill="none" stroke="#a05b36" stroke-width="2.5">
      <path d="M421 148h11q10 0 10-13V71" stroke-dasharray="4 5"/>
      <path d="m436 78 6-9 6 9"/>
    </g>
    <g class="vacuum-travel">
      <g class="vacuum-heading">
        <g class="sensor-rays" fill="none" stroke="#ac632e" stroke-width="2">
          <path d="M24-5 45-11M25 0h20M24 5l21 6"/>
        </g>
        <circle r="21" fill="#d1ddcb" stroke="#395643" stroke-width="2"/>
        <path d="M13-15q14 15 0 30" fill="none" stroke="#496553" stroke-width="4"/>
        <circle cx="-5" r="8" fill="#9eb79a" stroke="#496553" stroke-width="1.7"/>
        <circle cx="8" r="2" fill="#496553"/>
      </g>
    </g>
  </svg>
  <div class="cycle-controls" hidden>
    <div class="stage-buttons" role="group" aria-label="Vacuum stage">
      <button type="button" data-stage-choice="sense" aria-pressed="true">Sense</button>
      <button type="button" data-stage-choice="think" aria-pressed="false">Think</button>
      <button type="button" data-stage-choice="act" aria-pressed="false">Act</button>
    </div>
    <button type="button" class="robot-button secondary" data-replay>↻ Replay</button>
  </div>
  <p class="stage-caption" aria-live="polite">The distance sensor detects the wall just ahead.</p>
  <noscript>The controller chooses a left turn. The wheels turn the vacuum and drive it along the wall.</noscript>
</section>

Let's take our little robot vacuum as an example. Imagine it's happily cleaning your living room when suddenly... there's a wall.

First, it **senses** the obstacle using its sensors. Then, its controller **processes** that information and decides that continuing straight ahead probably isn't a great idea. Finally, it **acts** by turning its wheels and moving in another direction. And off it goes, continuing its very important mission of keeping your floor clean.

Pretty simple, right? Of course, real robots can be much more complicated than that, with multiple sensors and control processes running at once. But Sense → Think → Act is a nice starting point for understanding what's happening behind the scenes.

And notice something important here: the "Think" part doesn't necessarily mean the robot is actually thinking like a human. Sometimes it's just following a simple rule, such as "if there's an obstacle ahead, turn left."

## So, let's go back to our examples

Remember the robot vacuum, dishwasher and factory arm from earlier? Now that we know a little more about robotics, let's see how they compare.

<section class="robot-activity machine-explorer" aria-labelledby="machines-title">
  <h3 id="machines-title">Meet the machines</h3>
  <p class="activity-hint">Select a machine to trace one action from sensor to movement.</p>
  <details name="machine-breakdown" open>
    <summary><img src="../../images/what-is-a-robot/vacuum.svg" width="220" height="150" alt=""><span>Robot vacuum</span></summary>
    <div class="machine-info">
      <dl>
        <div><dt>Sensor</dt><dd>A bumper switch registers contact with a chair leg.</dd></div>
        <div><dt>Controller</dt><dd>The controller chooses a new heading when the bumper is pressed.</dd></div>
        <div><dt>Action</dt><dd>The wheel motors steer the vacuum around the chair.</dd></div>
      </dl>
      <p><strong>Robot.</strong> It controls its own path through the room as it cleans.</p>
    </div>
  </details>
  <details name="machine-breakdown">
    <summary><img src="../../images/what-is-a-robot/dishwasher.svg" width="220" height="150" alt=""><span>Dishwasher</span></summary>
    <div class="machine-info">
      <dl>
        <div><dt>Sensor</dt><dd>An optical sensor measures how cloudy the wash water is.</dd></div>
        <div><dt>Controller</dt><dd>The wash program uses that reading to decide whether to add a rinse.</dd></div>
        <div><dt>Action</dt><dd>A pump sends water through the spray arms to rinse the dishes.</dd></div>
      </dl>
      <p><strong>Automated appliance.</strong> A conventional dishwasher adjusts a fixed washing process. That is why it is usually classed as an automated appliance.</p>
    </div>
  </details>
  <details name="machine-breakdown">
    <summary><img src="../../images/what-is-a-robot/arm.svg" width="220" height="150" alt=""><span>Factory arm</span></summary>
    <div class="machine-info">
      <dl>
        <div><dt>Sensor</dt><dd>Joint encoders measure the angles of the arm’s joints.</dd></div>
        <div><dt>Controller</dt><dd>The controller compares those angles with the programmed pick-and-place path.</dd></div>
        <div><dt>Action</dt><dd>Motors move the arm into position and the gripper lifts the part.</dd></div>
      </dl>
      <p><strong>Robot.</strong> Its programmable joints can guide a tool or an object through different paths. A taught sequence is enough to do the job.</p>
    </div>
  </details>
</section>

- The **robot vacuum** can navigate around its environment and control its own movement.
- The **factory arm** can perform programmed physical movements, such as picking up an object and placing it somewhere else. It might use sensors, but it doesn't necessarily need sophisticated perception or AI to do its job.
- Wait a minute. If a **dishwasher** can sense things, make decisions and perform actions, why don't we call it a robot?

Well, that's where things get a little confusing. Because sensing and following instructions aren't exclusive to robots. Plenty of ordinary machines can do that too!

What usually sets robots apart is how they use controlled physical movement to navigate their environment or manipulate things around them. And even then, the boundary isn't always perfectly clear. That's why simply having sensors and following instructions isn't enough to make something a robot.

And honestly, when robotic arms and robot vacuums first came out, I bet they felt just as futuristic as the robots we see in movies today. We've just gotten so used to them that we don't think much about it anymore. (Which is kinda funny if you think about it!)

## But if robots have been around for so long, what's different now?

This is where things start getting really interesting. For a long time, many robots were designed to do specific tasks in carefully controlled environments. A factory arm might be programmed to pick up an object from one exact position and place it at another. It could perform that task incredibly quickly and accurately, but if you suddenly moved the object somewhere unexpected, the robot might struggle.

And that's one of the big challenges in robotics. The real world is messy. Objects move, environments change, and things don't always go according to plan. You can't possibly write a separate rule for every situation a robot might encounter.

So, what if instead of telling a robot exactly what to do in every situation, we could **teach it how to learn?** That's one of the ideas driving modern robot learning. With advances in AI, robots can increasingly learn from demonstrations, recognise unfamiliar objects, adapt their actions to changing environments and even use learned models to help plan what to do next.

For example, instead of programming every single movement needed to pick up a cup, we could show a robot how to pick up different objects and train it to learn patterns that might help it handle a cup it has never seen before. Of course, this doesn't mean robots can suddenly think or reason exactly like humans. They still make mistakes, struggle with unfamiliar situations and often need a lot of training.

But the goal is changing. Rather than building a robot that can perform just one carefully programmed task, researchers are working towards robots that can learn many different tasks, adapt to new environments and become more useful in our everyday lives.

And personally, I think that's one of the most exciting things happening in robotics right now. Because imagine having a robot at home that doesn't just vacuum your floor, but can help you fold laundry, tidy your room, put things away or even make you breakfast. (Although, knowing myself, I'd probably spend more time teaching it to do something silly than actually making it useful lol.)

We're definitely not quite there yet, at least not in the way sci-fi movies imagine it. But we're getting closer, and there's still so much interesting research happening along the way.

So, I guess the next question is... **If robots can already follow instructions, how do we actually teach them to learn?** And that's a whole other topic I want to explore next!

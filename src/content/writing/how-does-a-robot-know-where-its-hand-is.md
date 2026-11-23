---
title: "How Does a Robot Know Where Its Hand Is?"
description: "If we know how much each robot joint rotates, can we figure out exactly where its hand ends up? Let's find out with a little bit of maths!"
date: 2026-11-23
category: "Back to Basics"
tags: ["Robotics", "Forward Kinematics", "Kinematics"]
---

# How Does a Robot Know Where Its Hand Is?

In my [previous post about robot joints](../how-do-robot-joints-actually-work/), we talked about different types of joints, how they move, and how connecting them together forms something called a *kinematic chain*. But that leaves us with another question: **How does a robot actually know where its hand is?**

Imagine you have a robot arm sitting on a table, and you tell it to rotate its first joint by 30°, its second joint by 45°, and its third joint by another 20°. The joints rotate, the robot moves, and its gripper ends up... somewhere. But where exactly? How can we figure out where the gripper is just by knowing how much each joint has rotated? And how can a robot work this out without having to measure the position of its hand every single time?

Well, turns out there's actually a mathematical way to do this. It's called **Forward Kinematics**, or **FK** for short. Don't worry, despite the fancy name, the basic idea is pretty straightforward. (Although there will be a little bit of maths involved. Sorry!)

## So, what exactly is forward kinematics?

Let's start with something familiar. Imagine you're holding your arm out in front of you. Now, without looking at your hand, could you figure out where it is? Well, if you know how much your shoulder is rotated, how much your elbow is bent, and the lengths of your upper arm and forearm, you can actually calculate where your hand should be relative to your shoulder!

That's essentially what forward kinematics does. **Forward kinematics is the process of calculating where a robot's end effector is, and how it's oriented, based on its joint configuration and geometry.** In simpler terms, we start with information we already know about the robot, like the angles of its joints and the lengths of its links, and use that to work out where its hand ends up.

Think of it like following directions. If I tell you to walk 5 metres forward, turn 90°, and then walk another 3 metres, you could work out where you ended up relative to where you started. You just need to know the distances you travelled and the directions you turned. Forward kinematics follows a similar idea, except instead of walking around, we're moving through the links and joints of a robot.

**Joint angles + link lengths → where the robot's hand is**

That's the basic idea! Of course, real robot arms can have lots of joints and move in three-dimensional space, which makes things a bit more complicated. But rather than jumping straight into a six-joint robot arm, let's start with something much simpler: a robot arm with just one joint.

## Let's start with one joint

Imagine we have a really simple robot arm. It has one rigid link, connected to a rotating joint at its base. That's it. When the joint rotates, the link rotates with it, and the tip of the arm moves around in a circle. Nothing too complicated so far, right?

Now, let's say our link is **10 cm long**, and we rotate the joint **30° counterclockwise from the horizontal**. Here's a question for you: can we figure out exactly where the tip of the arm ends up?

Well, yes! And we're going to do it using a little bit of high school trigonometry. Yep, we're bringing back sine and cosine!

### First, let's figure out what we're actually looking for

Before jumping into any equations, let's think about what it means to know the position of our robot's tip. Imagine drawing two lines on the table: one going left and right, and another going up and down on our diagram. We'll call these our X-axis and Y-axis. Where they meet is called the **origin**, which we'll write as (0, 0).

For now, let's place our robot's base right at that origin. So, if I ask you where the tip of the robot is, what I'm really asking is how far the tip is to the right or left of the base, and how far it is above or below the base in our diagram. Those two distances give us the **X and Y coordinates** of the tip. And because our robot only moves in a flat, two-dimensional plane, that's all we need to describe its position.

### So, how do we calculate those distances?

Let's look at our robot again. We know two things: the length of the arm is 10 cm, and the angle between the arm and the horizontal X-axis is 30°.

Now imagine drawing a vertical line from the tip of the arm down to the X-axis. Suddenly, we've created a right-angled triangle!

<section class="robot-activity shapes-activity fk-activity" id="one-joint-robot" aria-labelledby="one-joint-robot-title">
  <h3 id="one-joint-robot-title">The One-Joint Robot</h3>
  <p class="activity-hint">Turn the 10 cm link. Follow the green horizontal side for X and the dashed brass side for Y.</p>
  <div data-fk-demo="one-joint-robot"></div>
  <noscript>At 30°, the tip is 8.66 cm to the right and 5 cm above the base.</noscript>
</section>

The arm itself is the longest side of our triangle, also known as the *hypotenuse*. The horizontal distance is the side next to our angle, or the *adjacent* side, while the vertical distance is the side opposite our angle.

Now, if you remember a little bit of trigonometry, you might recognise these two equations:

**cos(θ) = adjacent / hypotenuse**

**sin(θ) = opposite / hypotenuse**

Don't worry if you haven't used these in a while! For our robot, all we're doing is using the angle to figure out how much of the arm's length contributes to the horizontal and vertical directions.

Think about it this way. If the arm points completely to the right, all 10 cm contributes to X, and none to Y. If it points straight up, none of its length contributes to X, and all 10 cm contributes to Y. And when it's somewhere in between, the length is split between the two directions. That's exactly what sine and cosine help us calculate!

Let's call the length of our arm **L**, and the angle it makes with the horizontal **θ** (theta). Since the arm is the hypotenuse, we can rearrange our equations to get:

**x = L cos(θ)**

**y = L sin(θ)**

And that's our very first forward kinematics calculation!

### Let's try it with actual numbers

Remember our example? Our robot arm is 10 cm long and rotated 30° from the horizontal. We can substitute those values into our equations:

**x = 10 × cos(30°) ≈ 8.66 cm**

**y = 10 × sin(30°) = 5 cm**

Which means the tip of our robot is at approximately **(8.66, 5) cm**.

That's it! We now know that the tip is about 8.66 cm to the right and 5 cm above our starting point. And we figured that out without needing a camera or a ruler to measure the tip's position. All we needed was the length of the arm, the joint angle, and a little bit of maths. Pretty cool, right?

Now, this is all well and good for a robot with only one joint. But real robot arms usually have more than one. So... what happens when we add another joint?

## What if our robot has two joints?

Okay, let's make things a little more interesting. Imagine we attach another link to the end of our first link, with another rotating joint connecting them. We now have a robot arm with **two links and two revolute joints**.

Let's call the length of our first link **L₁** and the length of the second link **L₂**. The first joint rotates by an angle **θ₁**, while the second joint rotates by **θ₂**, measured relative to the first link. The first joint is at the base, and the second joint is at what we'll call the elbow. At the very end of the second link is our gripper.

<section class="robot-activity shapes-activity fk-activity" id="two-joint-robot" aria-labelledby="two-joint-robot-title">
  <h3 id="two-joint-robot-title">Build a Two-Joint Robot Arm</h3>
  <p class="activity-hint">Add the elbow and try each slider. At the shoulder, θ₁ starts from the positive X-axis. At the elbow, θ₂ starts from the dashed extension of the first link.</p>
  <div data-fk-demo="two-joint-robot"></div>
  <noscript>Turning the shoulder carries both links. Turning the elbow carries only the second link.</noscript>
</section>

Try moving the first joint. Notice how both links move together? That's because the second link is attached to the first link, so when we rotate the first joint, everything connected after it moves as well. Now try moving the second joint. This time, the first link stays where it is, while the second link rotates around the elbow.

And this is where calculating the position of the gripper becomes a little more interesting. But don't worry, we already know most of the maths!

### Step 1: Find the elbow

Let's start by figuring out where the first link ends. This is exactly the same problem we just solved with our one-joint robot! The first link has a length of L₁, and it rotates by θ₁. So the position of the elbow is:

**x₁ = L₁ cos(θ₁)**

**y₁ = L₁ sin(θ₁)**

Easy enough! Now that we know where the elbow is, we can start thinking about the second link.

### Step 2: Which direction is the second link pointing?

Here's something important. You might think that because the second joint rotates by θ₂, we could just use that angle to calculate where the gripper is. But there's a small catch: **θ₂ is measured relative to the first link, not relative to the horizontal X-axis.**

Let's imagine that our first link is rotated 30° from the horizontal. Now we rotate the second joint another 45° counterclockwise, relative to the first link. What angle is our second link making with the horizontal?

Well, the first link is already pointing 30° above the horizontal, and the second link rotates another 45° from that direction. So the second link is actually pointing **30° + 45° = 75°** above the horizontal!

Ahh, see where this is going? The direction of the second link depends on **both joint angles**, not just the second one. So, to describe the second link's angle relative to our original X-axis, we need **θ₁ + θ₂**.

This is probably the most important thing to understand about our two-joint robot. Even though the joints can rotate independently, the final position of the gripper depends on how their movements combine.

### Step 3: Travel from the elbow to the gripper

Now that we know which direction the second link is pointing, we can calculate how far it extends horizontally and vertically from the elbow. And luckily, it's the exact same trigonometry we used earlier!

The second link has length L₂, and its angle relative to the horizontal is θ₁ + θ₂. So its contribution is:

**Δx₂ = L₂ cos(θ₁ + θ₂)**

**Δy₂ = L₂ sin(θ₁ + θ₂)**

The little triangle symbol, Δ (delta), just means *change*. So Δx₂ tells us how far we move horizontally from the elbow to the gripper, and Δy₂ tells us how far we move vertically.

But we're not quite finished yet, because these values tell us how far the gripper is from the elbow. What we actually want is its position relative to the robot's base.

### Step 4: Put everything together!

Think about it like following directions again. First, we travel from the base to the elbow. Then, we travel from the elbow to the gripper. So to find the final position, we simply add those two movements together!

For the horizontal position, we have **x = x₁ + Δx₂**, and for the vertical position, we have **y = y₁ + Δy₂**.

Now, if we substitute the equations we worked out earlier, we get...

### Our two-link forward kinematics equations!

**x = L₁ cos(θ₁) + L₂ cos(θ₁ + θ₂)**

**y = L₁ sin(θ₁) + L₂ sin(θ₁ + θ₂)**

And there we have it! We can now calculate exactly where the gripper of our two-joint robot should be, using only the joint angles and link lengths.

I know the equations might look a little intimidating at first. But if you look closely, we're really just calculating how far each link moves us horizontally and vertically, then adding those movements together to find the final position. That's all!

### Let's put it to the test!

<section class="robot-activity shapes-activity fk-activity" id="forward-kinematics-calculator" aria-labelledby="forward-kinematics-calculator-title">
  <h3 id="forward-kinematics-calculator-title">Forward Kinematics Calculator</h3>
  <p class="activity-hint">Change an angle or a link length. The green arc measures θ₁ from the horizontal. The brass arc measures θ₂ from the first link’s direction. Follow the matching terms below to find the gripper.</p>
  <div data-fk-demo="forward-kinematics-calculator"></div>
  <noscript>For 10 cm and 8 cm links at joint angles of 30° and 45°, the gripper is at (10.73, 12.73) cm.</noscript>
</section>

Let's try one example together. Imagine our robot has a first link length of **10 cm**, a second link length of **8 cm**, a first joint angle of **30°**, and a second joint angle of **45°**.

First, let's calculate the elbow's position:

**x₁ = 10 × cos(30°) ≈ 8.66 cm**

**y₁ = 10 × sin(30°) = 5 cm**

Next, we calculate the second link's movement. Remember, its angle relative to the horizontal is 30° + 45° = 75°.

**Δx₂ = 8 × cos(75°) ≈ 2.07 cm**

**Δy₂ = 8 × sin(75°) ≈ 7.73 cm**

Finally, we add everything together:

**x = 8.66 + 2.07 = 10.73 cm**

**y = 5 + 7.73 = 12.73 cm**

So our gripper ends up at approximately **(10.73, 12.73) cm**. And just like that, we have calculated the position of our robot's hand!

Try changing θ₁ in the interactive example and notice how both links change their positions. Now try changing θ₂. The first link stays in place, but the gripper moves because the second link rotates around the elbow. Watch how the X and Y coordinates update every time you move a joint. That's forward kinematics happening right in front of you!

## But wait... where is (0, 0)?

There's one small detail worth mentioning before we move on.

Throughout our examples, we've been assuming that the robot's base is at (0, 0). But what if we moved the entire robot to the other side of the table? Would the gripper still have the same coordinates?

Well... it depends on what we're measuring its position relative to!

When we calculated (10.73, 12.73), we were measuring the gripper's position **relative to the robot's base**. If we moved the whole robot, those coordinates would stay the same relative to its base, assuming the joint angles didn't change. But its position relative to the table, or the room, would be different.

It's kind of like giving someone directions. If I tell you a coffee cup is 20 cm to the right of my laptop, that doesn't tell you where the cup is in the room unless you also know where my laptop is.

In robotics, we use something called a **coordinate frame** to define where we're measuring positions from, and which directions our axes point. For now, all you need to remember is that **a position only makes sense when we know what it's relative to**.

We'll explore coordinate frames properly in the next post, because they're really important when working with more complicated robots.

## So, does a robot always know exactly where its hand is?

Well... not automatically! Everything we've calculated so far assumes that we know the robot's joint angles and link lengths accurately. In a real robot, we can use sensors such as encoders to measure or estimate joint positions. Then, using the robot's geometry and our forward kinematics equations, we can estimate where the gripper should be.

But what if one of the joint sensors isn't calibrated correctly? Or the robot's links aren't exactly the lengths we assumed? Or something bends slightly when the robot picks up a heavy object? In those cases, our calculated position might not perfectly match where the gripper actually is.

And that's why things like calibration, sensing and feedback are so important in robotics. Forward kinematics tells us where the gripper *should be* according to our mathematical model. It doesn't guarantee that the gripper is exactly there in the real world.

Which could be a bit of a problem if our robot is trying to pick up a very full cup of coffee. (I really need to stop using coffee as an example before I convince myself to build a robot barista, which funny enough, being a barista was my previous job).

## So, what have we learned?

We've gone from a robot arm with just one joint to calculating the position of a two-joint arm using trigonometry. And along the way, we discovered that forward kinematics isn't really some mysterious mathematical trick. We're just figuring out how each part of the robot contributes to where its hand ends up.

For our one-joint robot, we used sine and cosine to calculate the tip's position. For our two-joint robot, we did essentially the same thing, except we had to account for the movements of both links.

And that's the main idea behind forward kinematics: **Given a robot's joint configuration and geometry, we can calculate the position and orientation of its end effector.** Our examples focused on position, but the same joint information can also tell us which direction the gripper is facing.

But here's another question. What if we had a robot with six or seven joints instead of just two? And what if those joints weren't all rotating in the same plane, but moving in different directions in three-dimensional space?

Could we still use sine and cosine to calculate where the gripper ends up? Well... technically, yes! But as we add more joints and start dealing with rotations in 3D, writing out separate equations for every movement would get messy pretty quickly. Imagine trying to keep track of six different joints, all rotating around different axes. No thanks.

Luckily, there's a much more convenient mathematical way to describe and combine those movements. It involves something called **transformation matrices**. (Yes, matrices. Again. They really are everywhere, aren't they?)

And that's what we'll explore in the next post! For now, I think we've had enough trigonometry for one day.

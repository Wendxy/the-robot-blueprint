---
title: "Robots Come in All Shapes and Sizes"
description: "Some robots have wheels, some have legs, and some are just giant arms bolted to the floor. Why do robots look so different, and what do all those joints actually do?"
date: 2026-11-22
category: "Back to Basics"
tags: ["Robotics", "Robot Anatomy", "Degrees of Freedom"]
---

In my [last post about what makes something a robot], we talked about how robots don't necessarily have to look like those super-intelligent, human-like machines we always see in sci-fi movies. In fact, robots can look like pretty much anything!

Some have wheels, some have legs, some have arms, and some are literally just giant mechanical arms bolted to the floor. And then there are humanoid robots, which researchers are trying very hard to make walk around like us. (And occasionally fall over like us too, lol.)

But have you ever wondered why robots look so different? Why does a factory robot usually look like a giant arm? Why does a robot vacuum have wheels instead of legs? And why do humanoid robots need so many joints just to pick something up?

Well, it turns out that the way a robot is built has a lot to do with what we want it to do. And to understand that, we first need to get familiar with a few different types of robots.

## So, how many types of robots are there?

Well... quite a lot, actually. There isn't really one single way to categorise every robot. We can group them by how they move, what they look like, or what they're designed to do.

For example, a robot might be **mobile**, meaning it can move from one place to another. Or it might be **fixed in place**, like those giant robotic arms you often see in car factories. And within those categories, things get even more interesting.

<section class="robot-activity shapes-activity" id="robot-gallery" aria-labelledby="robot-gallery-title">
  <h3 id="robot-gallery-title">Meet the Robots</h3>
  <p class="activity-hint">Select a robot to watch its movement repeat. Choose another to switch.</p>
  <div data-robot-demo="robot-gallery"></div>
  <noscript>Enable JavaScript to explore this activity.</noscript>
</section>

Let's start with some familiar ones. **Mobile robots** are pretty much what they sound like: robots that can move around their environment. Your little robot vacuum is one example. It uses wheels to navigate around your house while doing its cleaning duties. There are also mobile robots moving goods around warehouses, delivering food, or exploring places that might be too dangerous for humans.

Then we have **legged robots**, like quadrupeds and humanoids. Quadrupeds, as you might have guessed, have four legs. They're often inspired by animals like dogs, and their legs can help them move through uneven terrain or step over obstacles. Humanoids, on the other hand, are designed with a body structure somewhat similar to ours. Usually a head, torso, two arms and two legs.

And of course, we have **robotic arms**, also known as robot manipulators. These are probably some of the most common robots you'll come across in industrial settings. They're used for everything from assembling cars and welding metal to sorting packages and handling delicate objects. But here's something interesting: even within robotic arms, there are different types!

- An **articulated robot arm** has several rotating joints, a bit like a human arm.
- A **Cartesian robot** moves along straight axes, usually X, Y and Z. Imagine a 3D printer moving its print head around — it's a pretty similar idea.
- A **SCARA robot** is often used for fast assembly and pick-and-place tasks.
- And a **Delta robot** has a rather unusual structure with multiple linked arms working together, allowing it to move very quickly. You might see one sorting chocolates or picking items off a conveyor belt.

All of these robots can move things around, but they do it in completely different ways. Which brings us to the next question... **Why would we choose one robot over another?**

Well, a lot of it comes down to how the robot can move. And to understand that, we need to look at what's actually inside a robot arm.

## Let's take a robot arm apart (not literally!)

Imagine you're looking at a robotic arm sitting on a table. At first glance, it probably just looks like a bunch of metal pieces connected together with motors. And, well... that's not entirely wrong. But each part actually has a name and a purpose.

<section class="robot-activity shapes-activity" id="arm-anatomy" aria-labelledby="arm-anatomy-title">
  <h3 id="arm-anatomy-title">Anatomy of a Robot Arm</h3>
  <p class="activity-hint">Explore a part of the arm by pointing to it or selecting its name.</p>
  <div data-robot-demo="arm-anatomy"></div>
  <noscript>Enable JavaScript to explore this activity.</noscript>
</section>

First, we have the **base**. This is where the robot arm is mounted. For a fixed robot arm, the base usually stays in one place while the rest of the arm moves around it.

Then we have the **links**. These are the rigid pieces that connect the different parts of the robot together. Connecting those links are the **joints**, which allow the robot to move. We also have **actuators**, such as electric motors, which actually produce the movement. And **sensors**, which can measure things like joint positions, movement or forces.

Finally, at the very end of the robot arm, we have the **end effector**. That's just a fancy name for whatever tool the robot uses to interact with the world. It could be a gripper for picking things up, a welding tool, a suction cup, or even a paint sprayer. Think of it as the robot's hand, except its hand can be swapped out depending on the job. Pretty cool, right?

### But not all joints move the same way

In robotics, two very common types of joints are **revolute joints** and **prismatic joints**. A revolute joint rotates around an axis, kind of like your elbow bending. A prismatic joint moves in a straight line, like pulling a drawer in and out.

<section class="robot-activity shapes-activity" id="joint-playground" aria-labelledby="joint-playground-title">
  <h3 id="joint-playground-title">Joint Playground</h3>
  <p class="activity-hint">Move each slider to compare a joint that turns with one that slides.</p>
  <div data-robot-demo="joint-playground"></div>
  <noscript>Enable JavaScript to explore this activity.</noscript>
</section>

These might sound like tiny technical details, but combining different joints in different arrangements is one of the reasons robots can have such different shapes and capabilities. And there's actually a term we use to describe how many independent ways a robot can move. It's called **degrees of freedom**.

## Degrees of freedom... what?

Okay, this is probably one of the most important concepts to understand when you're first learning robotics. You'll often see people describing a robot arm as having 3 DOF, 6 DOF or 7 DOF. But what on earth does that mean?

**DOF stands for Degrees of Freedom.** Simply put, it describes the number of independent variables needed to specify how something can move or be configured.

Let's start with something really simple. Imagine you have a single rotating joint, like a door hinge. The hinge can rotate around one axis. You only need one angle to describe its position. That's **1 degree of freedom**.

Now imagine connecting another rotating joint to the first one. You can control the first joint and the second joint independently. You need two angles to describe the whole mechanism. That's **2 degrees of freedom**.

Add a third independent rotating joint, and now you have 3 DOF. See where this is going? For a simple robot arm made of independently controlled rotating joints, each joint typically adds one degree of freedom.

But here's where I think it gets much more interesting. Instead of just imagining joints rotating, why don't we actually try moving one?

<section class="robot-activity shapes-activity" id="arm-builder" aria-labelledby="arm-builder-title">
  <h3 id="arm-builder-title">Build Your Own Robot Arm</h3>
  <p class="activity-hint">Turn the shoulder, then add an elbow to see where the gripper can reach.</p>
  <div data-robot-demo="arm-builder"></div>
  <noscript>Enable JavaScript to explore this activity.</noscript>
</section>

Try moving the first joint. Notice how the whole arm moves around its base? Now add a second joint and move it. Suddenly, the end of the arm can reach many more positions without needing to move the base at all. That's why having multiple degrees of freedom can be so useful!

But there's a small catch. **More degrees of freedom don't automatically mean a robot is better.** They give the robot more possible ways to configure itself, but whether those extra movements are useful depends on what you're trying to do.

## Wait, so why do some robot arms have 6 or 7 DOF?

Okay, let's imagine we're trying to build a robot that can pick up a cup from a table. At first, it sounds pretty simple, right? Just move the gripper to the cup, close it, and pick it up.

But think about what actually needs to happen. The robot doesn't just need to move its gripper to the right location. It might also need to rotate the gripper so it approaches the cup from the correct direction. And that brings us to another important idea: **position and orientation**.

In a three-dimensional world, we can describe the position of an object using three coordinates:

- X: left and right
- Y: forward and backward
- Z: up and down

But that's only half the story. The object can also rotate in three different ways, usually described as **roll, pitch and yaw**. So, to fully describe the position and orientation of a rigid object in 3D space, we generally need six independent coordinates. Three for position, and three for orientation.

<section class="robot-activity shapes-activity" id="pose-explorer" aria-labelledby="pose-explorer-title">
  <h3 id="pose-explorer-title">The 6-DOF Explorer</h3>
  <p class="activity-hint">Move the cube through space, then switch to Orientation to turn it.</p>
  <div data-robot-demo="pose-explorer"></div>
  <noscript>Enable JavaScript to explore this activity.</noscript>
</section>

This is why **6-DOF robot arms** are so common. A suitably designed 6-DOF arm can control both the position and orientation of its end effector within its usable workspace. For example, it might be able to reach a cup from above, approach it from the side, or rotate its gripper to a particular angle.

Of course, having six joints doesn't mean the robot can reach absolutely anywhere or achieve every possible orientation. Its physical design and joint limits still matter.

And what about 7 DOF? Well, with seven independent arm joints, a robot can have an extra degree of flexibility when trying to achieve a particular gripper position and orientation. Think about how you can sometimes keep your hand in exactly the same place while moving your elbow around. That's roughly the idea.

A 7-DOF arm may be able to reach the same target in several different configurations, which can be really useful for avoiding obstacles or working in awkward spaces. Although, of course, all that extra flexibility also makes controlling the robot a bit more complicated.

## Can a robot reach anywhere it wants?

Unfortunately, no. Imagine you're sitting at your desk, and there's a cup of coffee just a little too far away. You can stretch your arm as much as you want, but unless you move your chair or stand up, you're probably not going to reach it.

Robot arms have the same problem. Every robot has physical limitations determined by things like the lengths of its links, the way its joints are arranged, and how far each joint is allowed to move. In robotics, we call the set of positions that a robot's end effector can reach its **reachable workspace**.

<section class="robot-activity shapes-activity" id="reach-the-cup" aria-labelledby="reach-the-cup-title">
  <h3 id="reach-the-cup-title">Can You Reach the Cup?</h3>
  <p class="activity-hint">Drag the cup or tap the table. Use the arrow keys on the cup for small adjustments.</p>
  <div data-robot-demo="reach-the-cup"></div>
  <noscript>Enable JavaScript to explore this activity.</noscript>
</section>

If the cup is inside the arm's reachable workspace, there may be a configuration of joints that allows the robot to reach it. If the cup is outside that region, well... good luck to our little robot. No amount of clever programming is going to make its arm magically grow longer.

And there's another complication. **Being able to reach an object doesn't necessarily mean being able to grab it in the way you want.** For example, a robot might be able to touch a cup but not rotate its gripper to approach the handle properly.

This is one reason researchers and engineers care about something called **dexterity** — how flexibly a robot can position and orient its end effector while performing tasks. So when we talk about robot capabilities, the number of joints is only one part of the story.

## So... why not just give every robot a hundred joints?

I mean, if more joints can give a robot more flexibility, why don't we just give every robot as many as possible? Wouldn't that make it super capable?

Well... not necessarily. Every additional joint usually means more mechanical parts, more actuators, more things to control, and potentially more things that can go wrong. And not every task actually needs that much flexibility.

Imagine a robot whose only job is to pick chocolates off a conveyor belt and place them into boxes. Would it really need two legs, two arms, five fingers on each hand and the ability to do a backflip? Probably not. A fast Delta robot might be much more suitable for that job.

On the other hand, if you wanted a robot to help around your house — opening cupboards, picking up different objects, folding clothes or navigating furniture — you might want a robot with a much more flexible body. Different tasks call for different designs.

And that's what I find so interesting about robotics. There isn't really one perfect robot body that works best for everything. Every design is a collection of trade-offs between flexibility, speed, precision, complexity, cost and the environment it's intended to work in. Which is also why building a robot that can handle all sorts of everyday tasks is so challenging.

## So, what have we learned?

We've met robots with wheels, legs and arms. We've looked at the different parts of a robotic arm, played around with joints, and learned why engineers keep talking about degrees of freedom.

But I think the most important takeaway is this: **The way a robot is built determines how it can interact with the world.** A robot with lots of joints isn't necessarily smarter than a robot with only a few. And a robot with fewer degrees of freedom isn't necessarily worse. It all comes down to what we're asking the robot to do.

But now that we know how robots are built and what kinds of movements they're capable of, there's another question I've been wondering about. Imagine you have a robot arm with six different joints, and you want its gripper to move to a particular spot on the table.

You know where you want the gripper to go. But how does the robot figure out **exactly how much to rotate each joint to get there?** Does it just guess? (Well, hopefully not. I wouldn't want it accidentally flinging my coffee across the room.)

Turns out, there's a whole area of robotics dedicated to figuring that out. And that's where things like **forward kinematics and inverse kinematics** come in. But we'll leave that for another post!

[last post about what makes something a robot]: ../what-is-a-robot/

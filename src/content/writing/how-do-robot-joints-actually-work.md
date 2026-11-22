---
title: "How Do Robot Joints Actually Work?"
description: "Robots can bend, slide, and twist, but not every joint moves the same way. What are the different types of robot joints, and how do they work together?"
date: 2026-11-22
category: "Back to Basics"
tags: ["Robotics", "Robot Joints", "Kinematics"]
draft: true
---

In my [previous post](../how-do-you-actually-calculate-dof/), we talked about degrees of freedom (DOF), how to calculate them, and why having four joints doesn't necessarily mean having four independent movements. That got me thinking about the joints themselves. What exactly is a joint, and what makes it move? Think about your elbow, wrist, or shoulder. They're what allow us to bend our arms, rotate our wrists, and move our bodies around.

So, are robot joints basically the same as ours? Well... kind of! Both human joints and robot joints connect different parts together and allow certain movements while restricting others. But while our joints are made of bones, cartilage, ligaments and other tissues, robot joints are mechanical connections, often moved by motors and other actuators.

Like the joints in our bodies, robot joints move in different ways. Some rotate, some slide, and some can move in multiple directions. But why do robots need different types of joints? And how do all these movements come together to let a robot do something as complicated as picking up a cup of coffee? (Or more importantly, picking it up without spilling everything, lol.)

## First, what exactly is a joint?

Let's imagine we have two solid pieces of metal. If we just place them next to each other, they're completely separate objects. We can move either one around without affecting the other. But what if we connect them with a hinge? Now, the two pieces are connected, and they can only move relative to each other in a particular way. One piece can rotate around the hinge, but it can't just move off in any random direction.

Remember the rigid bodies we talked about in the previous post? In a robot, we often call those rigid pieces **links**. A **joint** is the mechanical connection between two links that determines how they can move relative to each other.

<section class="robot-activity shapes-activity joints-activity" id="meet-the-robot-arm" aria-labelledby="meet-the-robot-arm-title">
  <h3 id="meet-the-robot-arm-title">Meet the Robot Arm</h3>
  <p class="activity-hint">Highlight links or joints. Select a numbered pivot, then change its angle to see which links travel with it.</p>
  <div data-joint-demo="meet-the-robot-arm"></div>
  <noscript>The shoulder carries all three moving links, the elbow carries the last two, and the wrist carries the gripper.</noscript>
</section>

Think about a door hinge. It allows the door to swing open and closed, but it stops the door from sliding sideways or moving up and down. Those restrictions are what let us count degrees of freedom. Once the door is on its hinges, a single angle tells us how far it’s open.

## Not every joint moves the same way!

If you've ever looked at different robots, you'll notice that some joints rotate, some slide, and some can move in multiple directions. In robotics, there are several common types of joints, each with different movement constraints. Let's meet them!

<section class="robot-activity shapes-activity joints-activity" id="joint-type-playground" aria-labelledby="joint-type-playground-title">
  <h3 id="joint-type-playground-title">Joint Playground</h3>
  <p class="activity-hint">Choose a joint to see its movements together. Select one movement to follow its arrow, or pause and drag a slider to explore a pose. Dashed lines mark the axes. A dot in a ring marks a pin pointing towards you.</p>
  <div data-joint-demo="joint-type-playground"></div>
  <noscript>Revolute, prismatic and helical joints each allow one independent movement. Cylindrical and universal joints allow two. A spherical joint allows three.</noscript>
</section>

### 1. Revolute Joint (R)

Let's start with probably the most familiar one. A **revolute joint** allows rotation around a single axis. Imagine opening and closing a door, or bending your elbow. The joint rotates, but it doesn't slide or move in any other direction. That's one degree of freedom! Revolute joints are extremely common in robot arms. If you've seen an industrial robot moving its shoulder, elbow or wrist, there's a good chance you're looking at revolute joints.

Because a revolute joint rotates around one axis, we can describe its position using a single angle, usually written as **θ (theta)**. So if I tell you that a revolute joint is at 45°, you know how far it has rotated relative to its reference position.

### 2. Prismatic Joint (P)

Now, instead of rotating, imagine a joint that slides back and forth. That's a **prismatic joint**. Think of a drawer sliding in and out of a cabinet. It doesn't rotate around an axis. Instead, it moves along a straight line.

And just like a revolute joint, it has one degree of freedom. But instead of describing its position using an angle, we describe it using a distance or displacement, often written as **d**. For example, a prismatic joint might extend by 10 centimetres along its axis. You'll often find prismatic joints in Cartesian robots, linear actuators, and machines that need precise straight-line movement.

### 3. Helical Joint (H)

Imagine turning a screw. As it rotates, it also moves forward or backward along its axis. That's how a **helical joint** works. At first glance, you'd be forgiven for counting two degrees of freedom. After all, you can see the screw rotate and slide.

A helical joint has **one DOF** because the thread links those two movements. If you know how far the screw advances per turn, you can work out exactly how far it has travelled from how much you've turned it. You can't choose the distance and the angle independently.

### 4. Cylindrical Joint (C)

A cylindrical joint might look a little similar to a helical joint at first. It can also rotate and slide along the same axis. With a cylindrical joint, though, the rotation and translation can happen **independently**. You can rotate the sleeve without sliding it, slide it without rotating it, or do both at once. It takes two values to describe its position, an angle and a distance, so it has **2 DOF**.

### 5. Universal Joint (U)

Next up, we have the universal joint. Imagine a connection that can bend in two different directions, kind of like a wrist that can tilt up and down or side to side. A universal joint allows rotation around two intersecting axes. Since we can describe those movements using two independent angles, it has **2 DOF**. You'll find universal joints in various mechanical systems, including drive shafts and certain robotic mechanisms.

### 6. Spherical Joint (S)

Finally, we have the spherical joint, also known as a ball-and-socket joint. The easiest example is probably your shoulder. You can rotate your arm in different directions without needing to move your entire body. A spherical joint allows three independent rotations around a common point, so it has **3 DOF**. In the playground you can tilt the stem sideways, tilt it forwards, and twist it, all at the same time. Those are the three rotational coordinates we've chosen for this example.

And that gives us six common joint types! There's also a **fixed joint**, which doesn't allow any relative movement at all. It simply connects two links rigidly together, so it has zero DOF.

## Every joint has an axis

Now, there's one thing you might have noticed while exploring those joints. We keep talking about rotation *around an axis* and translation *along an axis*. But what exactly does that mean? Let's go back to our revolute joint. Imagine a wheel attached to a motor. When the motor turns, the wheel rotates around a particular line through its centre. That line is its **axis of rotation**.

If we change the orientation of that axis, the direction of the allowed movement changes too. For example, a rotating platform with a vertical axis can turn left and right, while a hinge with a horizontal axis can make an arm swing up and down. Both are revolute joints, but they create very different movements!

<section class="robot-activity shapes-activity joints-activity" id="find-the-joint-axis" aria-labelledby="find-the-joint-axis-title">
  <h3 id="find-the-joint-axis-title">Find the Joint Axis</h3>
  <p class="activity-hint">Turn the link, then change the axis and try the same angle again. The brass arrow shows the direction of positive rotation.</p>
  <div data-joint-demo="find-the-joint-axis"></div>
  <noscript>A vertical axis lets the link sweep horizontally. A horizontal axis lets it swing in a vertical plane.</noscript>
</section>

When we connect multiple joints together, the direction of each joint axis helps determine what movements the whole robot can produce. That's one reason two robots with the same number of joints can behave completely differently.

## But joints can't always move forever

A revolute joint can rotate around its axis, but how far can it actually turn? Think about the range of motion in your elbow. Robot joints often have similar restrictions. A joint might only be able to rotate between −90° and +90°, for example.

These are called **joint limits**. The limits can come from the physical design of the robot, such as mechanical stops, or from software and safety restrictions. Sometimes a joint is designed for continuous rotation, while other joints can only rotate through a certain range.

<section class="robot-activity shapes-activity joints-activity" id="joint-limits" aria-labelledby="joint-limits-title">
  <h3 id="joint-limits-title">Don't Break the Robot!</h3>
  <p class="activity-hint">Move the requested angle past either stop. Compare the dashed target with the solid link.</p>
  <div data-joint-demo="joint-limits"></div>
  <noscript>Requests range from −180° to +180°. The link stops at −90° or +90° until the requested angle comes back within range.</noscript>
</section>

Imagine you're trying to get a robot to pick up an object. The target might technically be close enough for the robot to reach, but getting there could require one of its joints to rotate beyond its allowed range. And unless we want to break our robot, that's probably not a great idea. Planning that reach means checking whether its joints can actually achieve the movement.

## So, what actually makes the joint move?

If a revolute joint can rotate, what actually makes it rotate? Does it just... decide to move? (That would make building robots a lot easier!) This is where **actuators** come in. An actuator is a component that produces physical motion. For many small robot arms, the actuator is an electric motor. When the robot's controller sends a command, the motor produces motion, often through a gearbox or other transmission mechanism, which moves the joint.

Imagine telling a robot arm to rotate its elbow by 30°. You send the command and the motor starts turning. How does it know when to stop? Many robot joints use position sensors, such as **encoders**, to measure joint or motor position. The controller can compare the desired position with the measured position and adjust the motor command accordingly. This is an example of a **feedback control system**.

<section class="robot-activity shapes-activity joints-activity" id="inside-a-robot-joint" aria-labelledby="inside-a-robot-joint-title">
  <h3 id="inside-a-robot-joint-title">Inside a Robot Joint</h3>
  <p class="activity-hint">Choose a target angle and watch the encoder reading catch up. Change the target mid-move to see the controller respond.</p>
  <div data-joint-demo="inside-a-robot-joint"></div>
  <noscript>The controller compares the target with the encoder reading, then commands the motor to reduce the difference.</noscript>
</section>

Try setting the target to 90° in the demo. The controller receives that angle and commands the motor to move the joint. As the joint turns, the encoder reports its position and the controller uses that reading to adjust the command. Different robots use different actuators and sensors, but you can follow the same feedback loop.

One thing worth mentioning here is that **not every joint needs its own motor**. Some joints are passive, meaning they aren't driven directly by an actuator. Instead, their movement is determined by forces and the motion of other connected parts. This happens quite often in closed-loop mechanisms, like the four-bar linkage we explored in the previous article.

## What happens when we connect multiple joints together?

Now that we've met the different joint types, let's put them together. Imagine we have a simple robot arm with three revolute joints. Each joint connects two links, forming a chain. We call this a **kinematic chain**. The word *kinematic* might sound a little intimidating, but it just means we're describing motion without worrying about the forces that cause it.

In an open-chain robot arm, one end is usually attached to a base, while the other end is free to move. And at the end of that chain, we often attach an end effector, like a gripper.

Try rotating the shoulder in the playground below. It carries the elbow, wrist and gripper along with it. Rotate the elbow, and the shoulder stays put while the forearm and gripper move. By the time you get to the wrist, you're turning just the gripper. Its final position depends on all three joint angles.

<section class="robot-activity shapes-activity joints-activity" id="kinematic-chain-playground" aria-labelledby="kinematic-chain-playground-title">
  <h3 id="kinematic-chain-playground-title">The Kinematic Chain Playground</h3>
  <p class="activity-hint">Set the three joint angles. Follow the dotted guides from the gripper to its X and Y coordinates, measured from the shoulder.</p>
  <div data-joint-demo="kinematic-chain-playground"></div>
  <noscript>Each joint angle is relative to the preceding link. Together the three angles and link lengths determine the gripper’s position and heading.</noscript>
</section>

Let's say the shoulder is at 30°, the elbow at 45° and the wrist at −20°. In that order, the three angles give us the arm's **joint configuration vector**, **q = [30°, 45°, −20°]ᵀ**.

For a robot with *n* independent one-DOF joints, we can write the same idea more generally as **q = [q₁, q₂, ..., qₙ]ᵀ**. Each entry represents one joint variable. For a revolute joint, it's an angle. For a prismatic joint, it's a linear displacement. When we know those values and the robot's geometry, we can work out how the whole robot is positioned.

Now, let's go back to our three-joint arm. Looking at those three angles, you might be able to guess roughly where the gripper is. How would you find its exact coordinates? And if you wanted it to pick up that cup of coffee, how would you work out which angles to command?

## So, what have we learned?

A robot's movement depends on what kinds of joints it has, how they're arranged, and how they work together. Each joint sets the movements its two links can make relative to each other. Its axes and limits shape where the arm can reach, and the motors, sensors and controller work together to get it there.

In the next post, we'll use the joint angles and link lengths to calculate exactly where the gripper is. That calculation is called **forward kinematics**. Yes, more maths, but I promise this one comes with a lot of moving robot arms.

### Curious to learn more?

If you're curious about how our own joints compare to the mechanical ones we build for robots, here are a few resources worth checking out!

- **[Synovial Joints — OpenStax Anatomy & Physiology](https://openstax.org/books/anatomy-and-physiology-2e/pages/9-4-synovial-joints)**  
  A look at how human joints work, from the hinge-like movement of our elbows to the ball-and-socket joints in our shoulders.

- **[Degrees of Freedom of a Robot — Modern Robotics](https://modernrobotics.northwestern.edu/nu-gm-book-resource/2-2-degrees-of-freedom-of-a-robot/)**  
  Explore different types of mechanical joints and how each one allows or restricts movement.

- **[Anatomy of Selected Synovial Joints — OpenStax](https://openstax.org/books/anatomy-and-physiology-2e/pages/9-6-anatomy-of-selected-synovial-joints)**  
  A closer look at the human shoulder and other joints, and why their movement is more complicated than a simple mechanical hinge.

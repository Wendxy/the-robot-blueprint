---
title: "How Do You Actually Calculate Degrees of Freedom?"
description: "Why does a four-bar linkage with four rotating joints have only one degree of freedom? Let's work it out with Grübler's formula."
date: 2026-11-22
category: "Back to Basics"
tags: ["Robotics", "Degrees of Freedom", "Kinematics"]
---

In my [previous post](../robots-come-in-all-shapes-and-sizes/), I briefly introduced one of the most important concepts in robotics: **Degrees of Freedom**, or DOF for short. We talked about how DOF describes the number of independent ways a robot can move, and how a robot arm with six independently moving joints typically has six degrees of freedom.

But how do we actually calculate it? Do we just count the number of joints and call it a day?

Well... most of the time, for a simple robot arm, yes! But it actually goes a little deeper than that.

Take a look at this robot mechanism, for example.

<section class="robot-activity shapes-activity" id="four-joint-mystery" aria-labelledby="four-joint-mystery-title">
  <h3 id="four-joint-mystery-title">The Four-Joint Mystery</h3>
  <p class="activity-hint">Drag the brass handles or use the angle sliders. Try changing just the elbow, then move the input link on the four-bar linkage.</p>
  <div data-robot-demo="four-joint-mystery"></div>
  <noscript>The open arm has three independent joint angles. The four-bar linkage has one independent angle because its links close a loop.</noscript>
</section>

The four-bar linkage has **four rotating joints**. So naturally, you might assume it has four degrees of freedom, right? Well, surprisingly enough, it only has **one DOF!**

Wait, what? How can something have four joints but only one independent movement?

It turns out that the number of joints isn't the only thing that matters. We also need to consider how those joints are connected and how they restrict each other's movement. And to understand that, we first need to go back to something a little more fundamental.

## First, what exactly is a configuration?

Before we start throwing formulas around, there's an important concept we should understand: **configuration**.

Imagine you have a robot arm sitting on a table. If I ask you, "Where is the robot?", you might tell me where its base is. But that doesn't really tell me everything, does it?

The arm could be fully stretched out, folded up, pointing towards the ceiling, or reaching for something on the table. All of these are different configurations of the same robot.

In robotics, a **configuration** describes how the robot is arranged, or more precisely, the positions of all the points that make up the robot.

Now, that sounds like an awful lot of information to keep track of. But luckily, we don't actually need to record the position of every single point. For a simple robot arm with independently rotating joints, we can usually describe its configuration just by knowing the angles of those joints.

For example, if a robot arm has two rotating joints, we might describe its configuration using two numbers:

- Joint 1 angle: 30°
- Joint 2 angle: 60°

And that's enough to tell us how the entire arm is positioned, assuming we know its structure and dimensions!

Now, imagine collecting **every possible configuration** that the robot could have. That collection is what we call the **Configuration Space**, or **C-space** for short.

And here's where DOF comes in. The number of degrees of freedom is the dimension of the configuration space. In simpler terms, it's the number of independent values we need to describe the robot's configuration. So, if we need two independent joint angles to describe our robot, it has two degrees of freedom.

Pretty straightforward so far, right? But what if the joints are connected in a way that means they can't move independently? That's where things get interesting.

## Let's start with a rigid body

Before calculating the DOF of an entire robot, let's look at something simpler: a **rigid body**. A rigid body is basically an object that doesn't change its shape when it moves.

Think of a solid wooden block. You can move it, rotate it, flip it around, but the distance between any two points on the block stays the same.

Robots are often modelled as collections of rigid bodies, which we call *links*, connected together by joints. Each rigid body has its own possible movements, but once we start connecting them, the joints restrict how those bodies can move relative to one another.

So, to understand the DOF of a robot, we first need to understand the DOF of a single rigid body. Let's imagine we have a rigid object floating freely in a three-dimensional space. How many degrees of freedom does it have?

You might already know the answer is **six**. Three for position, and three for orientation.

But why six? Why not five, or seven? Let's actually work it out!

## Counting the DOF of a rigid body

Imagine we have a rigid body floating in 3D space, and we're going to describe its position by choosing three points on it: A, B and C.

<section class="robot-activity shapes-activity" id="rigid-body-points" aria-labelledby="rigid-body-points-title">
  <h3 id="rigid-body-points-title">Building a Rigid Body</h3>
  <p class="activity-hint">Position each point, then fix it in place. Watch where the next point can go.</p>
  <div data-robot-demo="rigid-body-points"></div>
  <noscript>Point A can be anywhere in space. With A fixed, B lies on a sphere. With A and B fixed, C lies on a circle.</noscript>
</section>

### Step 1: Choose point A

Let's start with point A. Since we're in a three-dimensional space, we can place A pretty much anywhere we want. We can move it along the X-axis, Y-axis and Z-axis.

So we need three numbers to describe its position.

**Point A = 3 DOF**

Easy enough!

### Step 2: Choose point B

Now let's choose another point, B. At first, you might think we can also place B anywhere in 3D space, giving us another three degrees of freedom.

But here's the catch. Remember, we're dealing with a **rigid body**. That means the distance between A and B has to stay constant. We can't just move B wherever we want, because that would change the shape of our object.

Instead, B must lie somewhere on the surface of an imaginary sphere centred at A, with a radius equal to the distance between A and B. Imagine holding a stick at one end and moving the other end around. The length of the stick stays the same, but its tip can point in lots of different directions. That's basically what's happening here.

And to describe a position on the surface of a sphere, we only need two independent values, kind of like latitude and longitude on Earth. So even though B has three coordinates, one constraint removes one degree of freedom.

**Point B = 2 DOF**

### Step 3: Choose point C

Now let's add a third point, C. And this is where things get even more restricted. Since we're still dealing with a rigid body, the distances from C to A and from C to B must both stay constant. So C needs to satisfy two constraints!

Geometrically, C must lie on the intersection of two spheres: one centred at A, and the other centred at B. For our non-degenerate example, that intersection forms a circle.

And how many independent values do we need to describe a position on a circle? Just one!

**Point C = 1 DOF**

Now that we've fixed the positions of three non-collinear points A, B and C, we've completely determined the position and orientation of the rigid body. Any other point on the body is already fixed relative to these three points, so it doesn't add any more freedom.

Which means...

### 3 + 2 + 1 = 6 DOF!

That's it! A rigid body floating freely in three-dimensional space has six degrees of freedom. We usually describe those six freedoms as:

- **3 translational DOF:** Movement along X, Y and Z.
- **3 rotational DOF:** Rotation around three axes, commonly described using roll, pitch and yaw.

<section class="robot-activity shapes-activity" id="pose-explorer" aria-labelledby="pose-explorer-title">
  <h3 id="pose-explorer-title">Explore the Six Freedoms</h3>
  <p class="activity-hint">Use Position to slide the cube along X, Y and Z. Switch to Orientation to try roll, pitch and yaw at the same position.</p>
  <div data-robot-demo="pose-explorer"></div>
  <noscript>The cube has three independent translations and three rotations.</noscript>
</section>

And just like that, we've figured out where those six degrees of freedom come from!

But there's one more thing worth mentioning. If our rigid body were restricted to moving on a flat, two-dimensional plane, it would only have **three DOF**: movement along X and Y, plus rotation within the plane. This will become pretty important in a moment.

## Okay, but what about an actual robot?

Now that we know a rigid body has six degrees of freedom in 3D space, let's go back to our robot. Remember how I mentioned that robots are made of rigid links connected by joints?

Well, if we had several rigid bodies floating independently in space, each one would have its own six degrees of freedom. But the moment we connect them using joints, things change.

A joint doesn't just connect two links physically. It also **restricts how those links can move relative to each other**.

For example, a revolute joint only allows rotation around one axis. Without the joint, one rigid body could move and rotate freely relative to another, giving us six possible freedoms. But a revolute joint removes five of those relative freedoms, leaving only one: rotation around its axis.

So rather than simply counting all the movements, we can think of calculating DOF as:

**Total possible freedoms − Independent constraints**

And there's actually a formula that helps us do exactly that.

## Meet Grübler's Formula!

Okay, time for a little maths. Don't worry, it's not as scary as it looks.

For many common robot mechanisms, we can calculate the degrees of freedom using something called **Grübler's Formula**:

**M = m(N − 1 − J) + Σ fᵢ**

Where:

- **M:** The total degrees of freedom of the mechanism.
- **m:** The DOF of a free rigid body — 3 for planar mechanisms, or 6 for spatial mechanisms.
- **N:** The total number of links, including the fixed ground.
- **J:** The total number of joints.
- **fᵢ:** The number of freedoms allowed by joint i.

The Σ symbol just means we're adding up the freedoms allowed by all the joints.

The idea behind the formula is actually pretty simple. We start with the possible freedoms of all the moving rigid bodies, then subtract the constraints introduced by connecting them together.

The formula works when those joint constraints are independent. There are some special mechanisms where that assumption doesn't hold, but we won't dive too far into those today.

Now, let's put it to the test!

## Back to our four-joint mystery

Remember the mechanism we looked at in the beginning? It's called a **four-bar linkage**.

A four-bar linkage consists of four rigid links connected by four revolute joints, forming a closed loop. You might have seen mechanisms like this in machinery, suspension systems or folding mechanisms.

Let's count its DOF using Grübler's Formula.

<section class="robot-activity shapes-activity" id="four-bar-calculator" aria-labelledby="four-bar-calculator-title">
  <h3 id="four-bar-calculator-title">Grübler's Formula Calculator</h3>
  <p class="activity-hint">Drag left or right across either diagram to turn the driving joint, or choose Play motion. Select a formula term to see what it counts.</p>
  <div data-robot-demo="four-bar-calculator"></div>
  <noscript>The spatial arm has seven independent joint angles. M = 6(8 − 1 − 7) + 7 = 7 DOF. The planar four-bar linkage has one independent input. M = 3(4 − 1 − 4) + 4 = 1 DOF.</noscript>
</section>

1. First, because our four-bar linkage moves in a two-dimensional plane: **m = 3**

2. Next, we count the links. There are four links in total, including the fixed link connecting the two grounded pivots. **N = 4**

3. And we have four revolute joints. **J = 4**

4. Each revolute joint allows one rotational degree of freedom, so the sum of all the joint freedoms is: **Σ fᵢ = 4**

Now let's substitute everything into the formula:

**M = 3(4 − 1 − 4) + 4**\
**M = −3 + 4**\
**M = 1 DOF!**

And there we have it! Even though our mechanism has four rotating joints, it only has one independent degree of freedom.

Why? Because those four joints form a closed loop. Once we choose the position of one link, the geometry of the loop constrains where the other links can go. In other words, we can move the mechanism by controlling just one independent variable, and the other joints have to follow along.

That's why **counting joints doesn't always give us the number of degrees of freedom**. It's not just about how many joints exist, but how independently they can move. And that's the whole point of Grübler's Formula.

## So, what have we learned?

We've gone from simply counting joints to figuring out the degrees of freedom of a rigid body, understanding configuration space, and finally calculating the DOF of a mechanism using actual maths. Quite a journey for something that initially sounded as simple as counting to four, lol.

But if there's one thing I want you to take away from this post, it's this: **Degrees of freedom are about independent movement, not just the number of joints.**

A simple open-chain robot arm with independently moving revolute joints often has one DOF per joint. But once we start introducing closed loops and additional constraints, things become much more interesting. And understanding those constraints is an important part of understanding how robots move.

Now that we know how many independent movements a robot has, there's another question. What actually allows it to move in those ways?

Turns out, we can! And that's where **robot joins** come in.

But I think we've had enough maths for one day. We'll save those for another post!

### Curious to learn more?

If you want to dive a little deeper into degrees of freedom (or just play around with some mechanisms yourself!), here are some useful resources:

- **[Degrees of Freedom of a Rigid Body — Modern Robotics](https://modernrobotics.northwestern.edu/nu-gm-book-resource/2-1-degrees-of-freedom-of-a-rigid-body/)**  
  A short video explaining configuration space and why a rigid body in 3D has six degrees of freedom, including the 3 + 2 + 1 explanation. Super clear explanation.

- **[Degrees of Freedom of a Robot — Modern Robotics](https://modernrobotics.northwestern.edu/nu-gm-book-resource/2-2-degrees-of-freedom-of-a-robot/)**  
  Learn how to calculate DOF using Grübler's formula, and why four joints don't necessarily mean four degrees of freedom.

- **[Configuration Space Representation — Modern Robotics](https://modernrobotics.northwestern.edu/nu-gm-book-resource/2-3-2-configuration-space-representation/)**  
  A slightly more technical look at how we represent robot configurations mathematically.

- **[Four-Bar Mechanisms — GeoGebra](https://www.geogebra.org/m/xmAST89t)**  
  An interactive demonstration where you can move a four-bar linkage and see how its connected joints move together.

- **[Linkage & Mechanism Simulator — ABC Tools](https://abc.tools/sim/linkage-simulator/)**  
  Play around with different mechanisms, adjust their links and explore how their movements are constrained.

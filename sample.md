How it started — Fixed Screens
------------------------------

At the turn of the millennium we first started crafting interfaces in single view screens that made up the popular screen sizes at the time — most likely 640x480. Most of the time we did not even plan for the screen to scroll and rather had internal scroll bars to specific areas or pieces of text. Needless to say most of the web at the time was also built either in Flash, or in HTML with tables for layout. This was before smart phones and as things evolved we went through the first fundamental shift to responsive design. We’ve come a long way, CSS has evolved a great deal, and we started getting actual purpose built tools for the job from 2010.

How it’s going — Responsive Design
----------------------------------

With the release of CSS3 we gained access to media queries, and soon thereafter [Ethan Marcotte](https://alistapart.com/article/responsive-web-design/) coined the term “[Responsive Design](https://www.w3schools.com/html/html_responsive.asp)” towards the end of 2009. For over a decade we have been building layouts for the web with Responsive Web Design (RWD) as an approach to web design that adapts the screens we’re designing to a variety of devices and screen sizes — one whole screen at a time.

The concepts of Mobile-first and progressive enhancement became really popular approaches in the early days when mobile phones did not understand media queries or JavaScript yet and there was a lot of CSS that purely just weren’t supported yet.

In today’s terms, when we say Responsive Design, we think of a page that adapts its layout to the overall browser, screen size and the limitations projected onto the entire layout. We use media queries to change the whole page layout as we resize the design from a desktop to a mobile size.

Where to next — Component Driven
--------------------------------

Very soon, using this approach to Responsive Design, might be considered as outdated as using tables for page layout — like we did in the ’90s.

We get a lot of powerful tools with [viewport-based media queries](https://webflow.com/blog/responsive-web-design), but we also lack a lot of finesse as this is a one-size-fits-all solution for the whole page and that’s the same for each user. We lack the ability to respond to user needs, as well as the ability to inject responsive styles into components themselves.

When we talk about components, I’m referring to elements on the page that could be comprised of a collection of other elements. Think something like a card, a carousel or a testimonial block, each one comprising of various smaller “building blocks”. These components are pieced together to make up our web page. We can use global viewport information to style these components, but they are still not in control of owning their own styles. This makes it even more difficult when our design systems are component-based, and not page-based.

The good news is the ecosystem is changing, and with that, it’s changing pretty rapidly and requires a bit of a mind-shift as to how we think about designing and styling components and how they adapt to their surroundings.

CSS is evolving and a new era for responsive web design is on the horizon. As things stand, just over 10 years since we were first introduced to RWD, the ecosystem is ready for some pretty big changes to happen to CSS.

Let’s dig into what types of changes we could expect and how that might change our approach and how we consider the design of our interfaces.

Users can set preference-based media queries
--------------------------------------------

In short, we could expect new preference-based media queries that help us be more responsive to our users. They will give us the ability to style web experiences that align with our user’s own specific preferences or needs. This would allow us to adapt our UX to be specific to a specific user’s experience.

In no way is this a complete list, but to give you some ideas, these preference-based media queries could include:

@prefers-reduced-motion  
@prefers-contrast  
@prefers-reduced-transparency  
@prefers-color-scheme  
@inverted-colors

These would help us to build a more robust and personalised web experience, catered specifically to our user’s needs, especially for those with accessibility needs. To take this even further this could respect any settings a user might already have set in their operating system’s settings. So as an example when they’ve indicated that they [prefer reduced motion](https://egghead.io/lessons/css-use-media-queries-to-detect-a-user-preference-for-motion) in their Operating System, chances are good they might not appreciate a super flashy intro, loaders or fly in animations on your page. We could rather respect their preferences and create a motion enhanced experience for everyone else.

Another popular media query is `[@prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)` which allows us to change our design to light or dark mode, based on the user's preference and setting in their operating system. This does not rely on a UI switch the user needs to use to change to dark mode, this would just happen automatically.

> _Preference-based media queries would allow us to adapt our User Experience to be specific to a particular user’s experience._

Container queries to inject new life into your design system
------------------------------------------------------------

One of the most exciting emerging areas in CSS is “[container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries)”, also frequently called “element queries”. It’s hard to understate what the shift from page-based responsive design to container-based responsive design would do to evolve the design ecosystem. Even though it’s [not safe to use today](https://caniuse.com/css-container-queries), it’s important to understand the shift of where things are going.

In a nutshell, container queries would allow us to set rules based on the parent container, rather than the overall page. This means that any component is more self-contained, aligned to modern design systems, and truly become plug-and-play modules that could be moved to any page or layout without having to reconsider everything based on its new environment.

Container queries provide a much more dynamic approach to how we plan, design and build out specific components as the component itself owns it’s responsive information.

Even [Ethan Marcotte](https://ethanmarcotte.com/wrote/on-container-queries/) himself expresses why container queries are such a big deal that we should be looking into.

Considering various Form-Factors
--------------------------------

As there’s a shift and expansion with various form factors, something like new screen types, for example foldable screens, we need media queries to consider these scenarios. Of everything mentioned here, keep in mind this is the most experimental and just a work in progress still to try and work out any of the intricacies we might run into, also considering how form-factor might evolve in the future.

In the foldable screen example, there are some media queries in prototype that would allow you to target screen-spanning and how we allow our content to be changed according to its new surroundings. For example you could place a sidebar (or menu) on the one screen, and allow the content to scroll on the other screen.

Why do we need this?
--------------------

I know what you’re thinking, we’ve been designing for the web and using responsive web design for more than 10 years now. We are fairly content with it, so why should things change. Well, if we really look at it at the end of the day it’s about the User Experience of individual users. We are gearing towards a world where things are hyper relevant to the audience of 1. Our web experience should be nothing less than trying to adapt to the user’s needs. Further something like container queries makes so much sense with the developments in design systems and how we build for a more portable web.

With this in mind, this means we can now design macro layouts using page-based media queries, including screen spanning nuances, along with micro layouts using container queries on our components, along with user preference-based media queries to customise user experiences based on their unique preference and needs.
## Inspiration
Our generation is facing a mental health crisis. One group that is significantly impacted by this crisis is one that is close to our hearts; the developer community. In fact, in 2020, the Stack Overflow demographic [survey](https://insights.stackoverflow.com/survey/2020#demographics) showed that over 15% of the 65,000+ respondents admitted to having a mental health issue. We wanted to help reverse this trend by promoting openness and support within the community.

## What it does
Users can sign up for an account with their Google credentials, giving them access to ConsoleMates. Our UI is coding themed, and users can access all functionalities through our simulated console. Functionalities include sending letters, receiving and replying to letters, setting topic preferences, and viewing sentiment statistics. 

Users can compose a letter expressing whatever is on their mind and can anonymously send it off into our system where it will be matched with a reader. Readers can then respond if they choose. After this, correspondence options will conclude, keeping communication simple. This design choice avoids the commitment and pressure of a traditional pen-pal application, leaving users free to log on when they need it most. 

To maximize relatability between writer and reader, users can set topic preferences. These topics include: interviews, school, Leetcode, burnout, career, imposter syndrome, and other. After writing a letter, users can tag it with one or more of these topics, and it will be sent to a user with a matching preference.

When a letter is sent to our backend, it is passed through the Python library text2emotion. This gives the letter an associated sentiment, which we track over time. By using the stats command, the user can view a pie chart of which emotions their letters have conveyed, serving as a tool to monitor their feelings over time.

## How we built it
The backend is built with Python, Flask, and PostgreSQL. We created a REST API for our frontend to call and get any data we need to display to the user. All data is kept in a PostgreSQL database. To perform sentiment analysis, we used the Python library [Text2Emotion](https://shivamsharma26.github.io/text2emotion/).

The frontend is built with React and TypeScript/JavaScript. Mockups were done in Figma and used to model frontend development, bringing our idea to life. The simulated console makes use of a [premade console component](https://github.com/rohanchandra/javascript-terminal) and is tailored to our needs with custom command handlers. 

## Challenges we ran into

One major challenge we encountered was database design. This was one of the very first elements we planned out for the project, so it was critical that we did it correctly, or we would be tying up loose ends for the rest of the hack. There was a lot of data we wanted to handle; users, letters, topics, and more. So, to properly plan out the database, we took it to the whiteboard and planned out an Entity Relationship Diagram. We were really happy we took on the challenge of properly designing the database as it saved us a lot of trouble later!

A second challenge we faced was implementing the interactive console UI. We thought the design would really elevate our theme and make the experience more fun for users, but we had no idea where to start. Luckily, we found a great reusable React component that we could build off of, and we went from here. Figuring out how to get custom commands was still a huge challenge, but we’re so glad we were able to add this into our UI!

## Accomplishments that we're proud of

We are really proud of the product we created. The topic of mental health in the software developer community is close to our hearts and we are super glad we got to contribute our product to the cause. 

One thing we’re particularly proud of is our creative UI. We loved the idea of a cute, calming UI to bring a relaxing atmosphere to the app, and we feel like we achieved that. We felt like the coding theme was greatly enhanced by our interactive console feature, and we feel like that tied everything together!

Another element we’re proud to submit is our backend. Since our last hackathon, we’ve improved a lot in our backend development. This time, we were much more familiar with setting up the database, and we were able to create a cleaner backend as a result.

## What we learned

Broadly, we learned a ton about frontend and backend development. Specifically to our frontend, we went in-depth with how React and javascript worked with state saving. Another huge challenge we had to overcome was related to the implementation of a react terminal. This was a challenge for us because none of us had worked with this before. Working with front end is always a challenge so it was an amazing learning experience to work on a project that challenged us so actively. With regards to our backend, we learned a lot about how SQL queries work with database connections as well as initial database statements on how to initialize tables. Overall we feel like after this hackathon we have improved a ton in both frontend and backend development!

## What's next for ConsoleMates

We have some exciting ideas for ConsoleMates in the future! First, we would like to implement a gallery where you can save and revisit your favourite letters, refine the existing elements of our UI, and add support for mobile phones. Once this is done, we hope to add some finishing touches such as background music, an integrated VSCode editor for writing letters, and a sentiment-predicting ML algorithm that senses trends in letters. We are looking forward to seeing where this project takes us!

## Final Thoughts
Thanks for reading about ConsoleMates! We hope you love it.  

Side pot entry: Best User Experience
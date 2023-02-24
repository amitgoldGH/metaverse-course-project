# metaverse-course-project

A project done as part of Internet technologies course.
The frontend is written in ReactJS with Redux, while the backend is written in NodeJS Express & Mongoose+Mongodb.

It contains:
1. Login page with sign-up/login, the login and signup uses bcrypt and stores only hashed passwords. It uses cookies to skip login if a user previously logged in.

![image](https://user-images.githubusercontent.com/17098942/221113476-655f9565-64d8-4ca2-938d-c1606b49b728.png)


2. Game page, has a nav bar on top with a sign-out option (deleting cookies) information about which user is logged in and what type of user is logged in.

![image](https://user-images.githubusercontent.com/17098942/221113517-38616f0f-5c26-4a83-ba8d-9def2a4558c5.png)

3. Lot page with information / embedded game.

![image](https://user-images.githubusercontent.com/17098942/221113643-b0c6dab5-fa43-4e0d-bc1a-28c8cce6c4d9.png)


The project's requirements were to create a game similar to decentraland (but single player) with the following:

The game is based on having lots. Those lots can be of a few types:
1. Grass/Park
2. Road
3. Game lot

Park and road lots are owned by the system and cannot be bought/sold, while game lots can be listed as for sale or as not for sale by their user owners.

Game lots, as their name suggest can contain a game if the owner toggled to enable a game for his lot (The only game is numble, a previous project, that is hosted on netlify and embedded into the game lot's window).

The game has 2 user types, Dealers and Guests:
Dealers can buy and sell game lots, while guests can only play enabled games on the lots.

The color scheme is as follows:

Park/Grass lots are green
Road lots are Grey
Game lots owned by the current logged in user are Red
Game lots that aren't owned by the logged in user and are for sale are Blue
Game lots that aren't owned by the logged in user and are not for sale are Purple


If you are the owner of a lot, you have an additional menu (that isn't visible if you aren't the owner) letting you change settings on the lot:
1. For sale state
2. Price
3. Game enabling/disabling
4. Transferring ownership to another user.


Diagram of the frontend:
![image](https://user-images.githubusercontent.com/17098942/221114464-0375a2f7-003b-48f6-8f09-fbabbff79c87.png)


Diagram of the backend:
![image](https://user-images.githubusercontent.com/17098942/221114485-a182f038-67e9-4c6f-ae5b-9d0208c9d88f.png)

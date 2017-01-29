﻿"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db);

var q = require('q');

const wordArray = 
[
    'Acne', 'Acre', 'Addendum', 'Advertise', 'Aircraft', 'Aisle', 'Alligator', 'Alphabetize', 'America', 'Ankle', 'Apathy', 'Applause', 'Applesauc', 'Application', 'Archaeologist', 'Aristocrat', 'Arm', 'Armada', 'Asleep', 'Astronaut', 'Athlete', 'Atlantis', 'Aunt', 'Avocado', 
    'Baby-Sitter', 'Backbone', 'Bag', 'Baguette', 'Bald', 'Balloon', 'Banana', 'Banister', 'Baseball', 'Baseboards', 'Basketball', 'Bat', 'Battery', 'Beach', 'Beanstalk', 'Bedbug', 'Beer', 'Beethoven', 'Belt', 'Bib', 'Bicycle', 'Big', 'Bike', 'Billboard', 'Bird', 'Birthday', 'Bite', 'Blacksmith', 'Blanket', 'Bleach', 'Blimp', 'Blossom', 'Blueprint', 'Blunt', 'Blur', 'Boa', 'Boat', 'Bob', 'Bobsled', 'Body', 'Bomb', 'Bonnet', 'Book', 'Booth', 'Bowtie', 'Box', 'Boy', 'Brainstorm', 'Brand', 'Brave', 'Bride', 'Bridge', 'Broccoli', 'Broken', 'Broom', 'Bruise', 'Brunette', 'Bubble', 'Buddy', 'Buffalo', 'Bulb', 'Bunny', 'Bus', 'Buy', 
    'Cabin', 'Cafeteria', 'Cake', 'Calculator', 'Campsite', 'Can', 'Canada', 'Candle', 'Candy', 'Cape', 'Capitalism', 'Car', 'Cardboard', 'Cartography', 'Cat', 'Cd', 'Ceiling', 'Cell', 'Century', 'Chair', 'Chalk', 'Champion', 'Charger', 'Cheerleader', 'Chef', 'Chess', 'Chew', 'Chicken', 'Chime', 'China', 'Chocolate', 'Church', 'Circus', 'Clay', 'Cliff', 'Cloak', 'Clockwork', 'Clown', 'Clue', 'Coach', 'Coal', 'Coaster', 'Cog', 'Cold', 'College', 'Comfort', 'Computer', 'Cone', 'Constrictor', 'Continuum', 'Conversation', 'Cook', 'Coop', 'Cord', 'Corduroy', 'Cot', 'Cough', 'Cow', 'Cowboy', 'Crayon', 'Cream', 'Crisp', 'Criticize', 'Crow', 'Cruise', 'Crumb', 'Crust', 'Cuff', 'Curtain', 'Cuticle', 'Czar', 
    'Dad', 'Dart', 'Dawn', 'Day', 'Deep', 'Defect', 'Dent', 'Dentist', 'Desk', 'Dictionary', 'Dimple', 'Dirty', 'Dismantle', 'Ditch', 'Diver', 'Doctor', 'Dog', 'Doghouse', 'Doll', 'Dominoes', 'Door', 'Dot', 'Drain', 'Draw', 'Dream', 'Dress', 'Drink', 'Drip', 'Drums', 'Dryer', 'Duck', 'Dump', 'Dunk', 'Dust', 
    'Ear', 'Eat', 'Ebony', 'Elbow', 'Electricity', 'Elephant', 'Elevator', 'Elf', 'Elm', 'Engine', 'England', 'Ergonomic', 'Escalator', 'Eureka', 'Europe', 'Evolution', 'Extension', 'Eyebrow', 
    'Fan', 'Fancy', 'Fast', 'Feast', 'Fence', 'Feudalism', 'Fiddle', 'Figment', 'Finger', 'Fire', 'First', 'Fishing', 'Fix', 'Fizz', 'Flagpole', 'Flannel', 'Flashlight', 'Flock', 'Flotsam', 'Flower', 'Flu', 'Flush', 'Flutter', 'Fog', 'Foil', 'Football', 'Forehead', 'Forever', 'Fortnight', 'France', 'Freckle', 'Freight', 'Fringe', 'Frog', 'Frown', 
    'Gallop', 'Game', 'Garbage', 'Garden', 'Gasoline', 'Gem', 'Ginger', 'Gingerbread', 'Girl', 'Glasses', 'Goblin', 'Gold', 'Goodbye', 'Grandpa', 'Grape', 'Grass', 'Gratitude', 'Gray', 'Green', 'Guitar', 'Gum', 'Gumball', 
    'Hair', 'Half', 'Handle', 'Handwriting', 'Hang', 'Happy', 'Hat', 'Hatch', 'Headache', 'Heart', 'Hedge', 'Helicopter', 'Hem', 'Hide', 'Hill', 'Hockey', 'Homework', 'Honk', 'Hopscotch', 'Horse', 'Hose', 'Hot', 'House', 'Houseboat', 'Hug', 'Humidifier', 'Hungry', 'Hurdle', 'Hurt', 'Hut', 
    'Ice', 'Implode', 'Inn', 'Inquisition', 'Intern', 'Internet', 'Invitation', 'Ironic', 'Ivory', 'Ivy', 
    'Jade', 'Japan', 'Jeans', 'Jelly', 'Jet', 'Jig', 'Jog', 'Journal', 'Jump', 
    'Key', 'Killer', 'Kilogram', 'King', 'Kitchen', 'Kite', 'Knee', 'Kneel', 'Knife', 'Knight', 'Koala', 
    'Lace', 'Ladder', 'Ladybug', 'Lag', 'Landfill', 'Lap', 'Laugh', 'Laundry', 'Law', 'Lawn', 'Lawnmower', 'Leak', 'Leg', 'Letter', 'Level', 'Lifestyle', 'Ligament', 'Light', 'Lightsaber', 'Lime', 'Lion', 'Lizard', 'Log', 'Loiterer', 'Lollipop', 'Loveseat', 'Loyalty', 'Lunch', 'Lunchbox', 'Lyrics', 
    'Machine', 'Macho', 'Mailbox', 'Mammoth', 'Mark', 'Mars', 'Mascot', 'Mast', 'Matchstick', 'Mate', 'Mattress', 'Mess', 'Mexico', 'Midsummer', 'Mine', 'Mistake', 'Modern', 'Mold', 'Mom', 'Monday', 'Money', 'Monitor', 'Monster', 'Mooch', 'Moon', 'Mop', 'Moth', 'Motorcycle', 'Mountain', 'Mouse', 'Mower', 'Mud', 'Music', 'Mute', 
    'Nature', 'Negotiate', 'Neighbor', 'Nest', 'Neutron', 'Niece', 'Night', 'Nightmare', 'Nose', 
    'Oar', 'Observatory', 'Office', 'Oil', 'Old', 'Olympian', 'Opaque', 'Opener', 'Orbit', 'Organ', 'Organize', 'Outer', 'Outside', 'Ovation', 'Overture', 
    'Pail', 'Paint', 'Pajamas', 'Palace', 'Pants', 'Paper', 'Paper', 'Park', 'Parody', 'Party', 'Password', 'Pastry', 'Pawn', 'Pear', 'Pen', 'Pencil', 'Pendulum', 'Penny', 'Pepper', 'Personal', 'Philosopher', 'Phone', 'Photograph', 'Piano', 'Picnic', 'Pigpen', 'Pillow', 'Pilot', 'Pinch', 'Ping', 'Pinwheel', 'Pirate', 'Plaid', 'Plan', 'Plank', 'Plate', 'Platypus', 'Playground', 'Plow', 'Plumber', 'Pocket', 'Poem', 'Point', 'Pole', 'Pomp', 'Pong', 'Pool', 'Popsicle', 'Population', 'Portfolio', 'Positive', 'Post', 'Princess', 'Procrastinate', 'Protestant', 'Psychologist', 'Publisher', 'Punk', 'Puppet', 'Puppy', 'Push', 'Puzzle', 
    'Quarantine', 'Queen', 'Quicksand', 'Quiet', 
    'Race', 'Radio', 'Raft', 'Rag', 'Rainbow', 'Rainwater', 'Random', 'Ray', 'Recycle', 'Red', 'Regret', 'Reimbursement', 'Retaliate', 'Rib', 'Riddle', 'Rim', 'Rink', 'Roller', 'Room', 'Rose', 'Round', 'Roundabout', 'Rung', 'Runt', 'Rut', 
    'Sad', 'Safe', 'Salmon', 'Salt', 'Sandbox', 'Sandcastle', 'Sandwich', 'Sash', 'Satellite', 'Scar', 'Scared', 'School', 'Scoundrel', 'Scramble', 'Scuff', 'Seashell', 'Season', 'Sentence', 'Sequins', 'Set', 'Shaft', 'Shallow', 'Shampoo', 'Shark', 'Sheep', 'Sheets', 'Sheriff', 'Shipwreck', 'Shirt', 'Shoelace', 'Short', 'Shower', 'Shrink', 'Sick', 'Siesta', 'Silhouette', 'Singer', 'Sip', 'Skate', 'Skating', 'Ski', 'Slam', 'Sleep', 'Sling', 'Slow', 'Slump', 'Smith', 'Sneeze', 'Snow', 'Snuggle', 'Song', 'Space', 'Spare', 'Speakers', 'Spider', 'Spit', 'Sponge', 'Spool', 'Spoon', 'Spring', 'Sprinkler', 'Spy', 'Square', 'Squint', 'Stairs', 'Standing', 'Star', 'State', 'Stick', 'Stockholder', 'Stoplight', 'Stout', 'Stove', 'Stowaway', 'Straw', 'Stream', 'Streamline', 'Stripe', 'Student', 'Sun', 'Sunburn', 'Sushi', 'Swamp', 'Swarm', 'Sweater', 'Swimming', 'Swing', 
    'Tachometer', 'Talk', 'Taxi', 'Teacher', 'Teapot', 'Teenager', 'Telephone', 'Ten', 'Tennis', 'Thief', 'Think', 'Throne', 'Through', 'Thunder', 'Tide', 'Tiger', 'Time', 'Tinting', 'Tiptoe', 'Tiptop', 'Tired', 'Tissue', 'Toast', 'Toilet', 'Tool', 'Toothbrush', 'Tornado', 'Tournament', 'Tractor', 'Train', 'Trash', 'Treasure', 'Tree', 'Triangle', 'Trip', 'Truck', 'Tub', 'Tuba', 'Tutor', 'Television', 'Twang', 'Twig', 'Twitterpated', 'Type', 
    'Unemployed', 'Upgrade', 
    'Vest', 'Vision', 
    'Wag', 'Water', 'Watermelon', 'Wax', 'Wedding', 'Weed', 'Welder', 'Whatever', 'Wheelchair', 'Whiplash', 'Whisk', 'Whistle', 'White', 'Wig', 'Will', 'Windmill', 'Winter', 'Wish', 'Wolf', 'Wool', 'World', 'Worm', 'Wristwatch', 
    'Yardstick', 
    'Zamboni', 'Zen', 'Zero', 'Zipper', 'Zone', 'Zoo'
]


var Game = require(__dirname + '/../../../js/games/game');

class GameManager
{

    static insert(game) {

        var deferred = q.defer();

        var collection = db.get('games');

        collection.insert(game, function (err, doc) {

            if (err) {
                logger.error('Could not insert game into database ' + err);
                return deferred.reject(err);
            }

            return deferred.resolve(new Game(doc));

        });

        return deferred.promise;

    }


    static create() {

        logger.info("Create game");

        var board = this.generateBoard();

        var game = new Game({ board: board });

        return this.insert(game)

            .then(function(newGame) { 

                return { data: newGame };

            });
            

    }

    static generateBoard() {

        var board =
        {
            rows: []
        }

        var usedWords = {};

        var word = null;

        for (var r=0; r < 5; r++)
        {
            // intialize each row
            board.rows[r] = [];

            for (var c=0; c < 5; c++)
            {
                do {

                    word = wordArray[Math.floor(Math.random() * wordArray.length)];

                } while (usedWords.hasOwnProperty[word]);

                board.rows[r].push({ word: word });
                usedWords[word] = true;
            }

        }

        var taken = {};
        var row = 0;
        var column = 0;

        for (var red=0; red < 8; red++)
        {

            do
            {
                row = Math.floor(Math.random() * 5);
                column = Math.floor(Math.random() * 5);
            }
            while (taken.hasOwnProperty(board.rows[row][column].word));

            board.rows[row][column].role = 'red';

            // mark the word as assigned already
            taken[board.rows[row][column].word] = true;

        }   // red team assigments

        for (var blue=0; blue < 8; blue++)
        {

            do
            {
                row = Math.floor(Math.random() * 5);
                column = Math.floor(Math.random() * 5);
            }
            while (taken.hasOwnProperty(board.rows[row][column].word));

            board.rows[row][column].role = 'blue';

            // mark the word as assigned already
            taken[board.rows[row][column].word] = true;

        }   // blue team assigments
        
        // assign the extra team member
        do
        {
            row = Math.floor(Math.random() * 5);
            column = Math.floor(Math.random() * 5);
        }
        while (taken.hasOwnProperty(board.rows[row][column].word));

        board.rows[row][column].role = Math.random() < 0.5 ? 'blue' : 'red';

        // mark the word as assigned already
        taken[board.rows[row][column].word] = true;

            
        // mark the assassin
        do
        {
            row = Math.floor(Math.random() * 5);
            column = Math.floor(Math.random() * 5);
        }
        while (taken.hasOwnProperty(board.rows[row][column].word));

        board.rows[row][column].role = 'assassin';

        // mark the word as assigned already
        taken[board.rows[row][column].word] = true;

        // assign the rest to be bystanders of some sort
        for (row=0; row < 5; row++)
        {
            for (column = 0; column < 5; column++)
            {
                if (!board.rows[row][column].role)
                {
                    board.rows[row][column].role = Math.random() < 0.5 ? 'bystander1': 'bystander2';
                }
            }
        }


        return board;

    }


}  // end class declaration


module.exports = GameManager;



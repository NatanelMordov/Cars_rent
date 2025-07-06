/* DB informations
 host: 'localhost',
  user: 'root',
  password: 'carproject11',
  database: 'car_rental'
  */

CREATE DATABASE car_rental;
USE car_rental;



/*-------------------------------------------------------------------------------------------------*/
CREATE TABLE users (
  username VARCHAR(100) NOT NULL primary key,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE, 
  points int default 0
);

INSERT INTO users (username, email, password, is_admin, points)
VALUES ('Roger', 'roger@gmail.com', '123123', True,0),
('Lina', 'lina@gmail.com', '123123', False,120);

select * from users

/*-------------------------------------------------------------------------------------------------*/


CREATE TABLE cars (
  id int auto_increment primary key,
  manufacturers VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  yearsOfProduction INT  NOT NULL,  
  fuels VARCHAR(100) NOT NULL,
  gear VARCHAR(100) NOT NULL,
  priceperday INT NOT NULL,
  location VARCHAR(100)  NOT NULL,
  inventory INT not null,
  rating_sum INT DEFAULT 0,
  rating_count INT DEFAULT 0
);


INSERT INTO cars (manufacturers, model, yearsOfProduction, fuels, gear, priceperday, location, inventory)
VALUES ('Audi','Q7', 2021, 'Diesel','Automatic', 150, 'Haifa', 3 ),
('Mercedes Benz','G Class', 2025, 'Gas','Automatic', 350, 'Haifa', 3 ),
 ('Mercedes Benz','G Class', 2024, 'Gas','Automatic', 350, 'Tel Aviv', 1 ),
 ('Mercedes Benz','G Class', 2025, 'Gas','Automatic', 350, 'TLV Airport', 5 ),
 ('BMW','M 135', 2023, 'Gas','Automatic', 250, 'Haifa', 2 ),
 ('BMW','i4', 2025, 'Gas','Automatic', 450, 'Tel Aviv', 0 ),
 ('BMW','M4', 2024, 'Gas','Automatic', 350, 'Haifa', 2 ),
 ('Mercedes Benz','EQA 250', 2025, 'Electric','Automatic', 350, 'Haifa', 2 ),
 ('Mercedes Benz','EQB 300', 2025, 'Electric','Automatic', 350, 'Haifa', 2 );


SELECT DISTINCT fuels FROM cars
SELECT DISTINCT yearsOfProduction FROM cars
SELECT * FROM cars WHERE fuels = 'Gas' and yearsOfProduction = 2024
select * from cars

/*-------------------------------------------------------------------------------------------------*/

CREATE TABLE cart (
  id int auto_increment primary key,
  username VARCHAR(100) NOT NULL,
  car_id int NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL, 
  totalprice INT NOT NULL, 
  status varchar(50) not null,
  rating INT DEFAULT NULL
);

INSERT INTO cart (username, car_id, start_date, end_date, totalprice, status)
VALUES ('Lina',6, '2025-06-10', '2025-06-20', 300, 'pending');


select * from cars
select * from cart

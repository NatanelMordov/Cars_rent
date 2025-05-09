CREATE DATABASE car_rental;
USE car_rental;



/*-------------------------------------------------------------------------------------------------*/




CREATE TABLE users (
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE
);

INSERT INTO users (username, email, password, is_admin)
VALUES ('Lina', 'lina@gmail.com', '123123', False);

select * from users


/*-------------------------------------------------------------------------------------------------*/



CREATE TABLE cars (
  manufacturers VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  yearsOfProduction VARCHAR(100)  NOT NULL,   /**need to correc type**/
  fuels VARCHAR(100) NOT NULL,
  gear VARCHAR(100) NOT NULL,
  priceperday VARCHAR(100) NOT NULL,
  location VARCHAR(100)  NOT NULL
);

INSERT INTO cars (manufacturers, model, yearsOfProduction, fuels, gear, priceperday, location)
VALUES ('Mercedes Benz','G Class', '2025', 'Gas','Automatic', '350$', 'Haifa' );


select * from cars

/*-------------------------------------------------------------------------------------------------*/


CREATE TABLE orders (
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100)  NOT NULL,
  startdate VARCHAR(100) NOT NULL,
  enddate VARCHAR(100) NOT NULL,
  totalprice numeric(65) NOT NULL,  /**need to correc type**/
  manufacturers VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  location VARCHAR(100)  NOT NULL
);


select * from orders



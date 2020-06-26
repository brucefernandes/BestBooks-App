create table publisher
	(pub_id		varchar(4),
	 name       varchar(50),
	 email      varchar(30),
	 phone_no   varchar(10),
	 bank_name  varchar(20),
	 cared_no   varchar(9),
	 primary key (pub_id)
	);
create table books
	(ISBN		varchar(7),
	 title		varchar(60),
	 genre		varchar(20),
	 author		varchar(60),
	 pub_id     varchar(4),
	 price		numeric(8,2),
	 quantity   numeric(2,0),
	 primary key (ISBN),
	 foreign key (pub_id) references publisher(pub_id)
	);



create table published_by
	(pub_id		varchar(4),
	 ISBN		varchar(7),
	 primary key (pub_id),
	 foreign key (pub_id) references publisher,
	 foreign key (ISBN) references books(ISBN)
	);

create table users
	(user_id     varchar(5),
	 name	     varchar(50),
	 street      varchar(50),
	 apt_no      numeric(3,0),
	 city        varchar(20),
	 bank_name   varchar(10),
	 card_no     varchar(9),
	 registered  boolean,

	 primary key (user_id)

	);

create table orders
	( user_id     varchar(4),
	  ISBN		varchar(7),

	  primary key (user_id,ISBN),
	  foreign Key (user_id) references users(user_id),
	  foreign Key (ISBN) references books(ISBN)

	);

create table tracking_info(
	order_no varchar(5),
	title varchar(60),
	location varchar(40),
	day numeric(2,0),
	month numeric(2,0),
	tracking_no varchar(5),

	primary key (tracking_no)

);

create table bookstore(
	user_id varchar(5),
	ISBN    varchar(7),
	title   varchar(60),
	price   numeric(8,2),
	order_no varchar(5),
	tracking_no varchar(5),
	primary key (order_no),
	foreign key (tracking_no) references tracking_info(tracking_no)

);

create table tracks(
	tracking_no 	varchar(5),
	ISBN 			varchar(7),
	user_id 		varchar(4),
	order_no 		varchar(5),

	primary key (tracking_no),
	foreign key (tracking_no) references tracking_info,
	foreign key (order_no) references bookstore


);

create table collection(
	order_no 	varchar(5),
	ISBN		varchar(7),
	pub_id		varchar(4),
	user_id		varchar(4),

	primary key (order_no),
	foreign key (order_no) references bookstore,
	foreign key (ISBN) references books


);

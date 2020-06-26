delete from books;
delete from publisher;
delete from published_by;

-- INserting publishers
insert into publisher values ('1234', 'Collin', 'collin@gmail.com', '506518136', 'scotia', '415318056');
insert into publisher values ('5678', 'Pearson', 'pearson@gmail.com', '8193180458', 'adcb', '941236701');
insert into publisher values ('9191', 'Goldman', 'goldman@gmail.com', '562848726', 'RBC', '652739016');
insert into publisher values ('1124', 'Hallmark', 'hallmark@gmail.com', '563180458', 'TDCanada', '523177599');
insert into publisher values ('4788', 'Maryburn', 'maryburn@gmail.com', '569904583', 'TDCanada', '312456763');


--Inserting books
insert into books values ('1010617', 'Harry Potter and the Philosophers Stone', 'Fantasy', 'J.K Rowling', '1234', '45.50','12');
insert into books values ('1010123', 'Hunger Games', 'Dystopian', 'Suzanne Collins', '1234', '39.95','15');
insert into books values ('1010234', 'Champion', 'Dystopian', 'Marie Lu', '5678', '55.49','19');
insert into books values ('1010345', 'Prodigy', 'Dystopian', 'Marie Lu', '5678', '55.49','17');
insert into books values ('1010456', 'Legend', 'Dystopian', 'Marie Lu', '5678', '55.49','11');
insert into books values ('1010567', 'Game of thrones One', 'Fantasy', 'George Martin', '9191', '60.49','25');
insert into books values ('1010678', 'Romeo and Juliet', 'Romance', 'W.Shakespeare', '4788', '19.99','35');
insert into books values ('1010789', 'Merchant of Venice', 'Satire', 'W.Shakespeare', '4788', '19.99','34');
insert into books values ('1010890', 'Oliver Twist', 'Satire', 'Charles Dickens', '1124', '12.49','23');
insert into books values ('1010321', 'Hamlet', 'Drama', 'W.Shakespeare', '4788', '45.50','12');
insert into books values ('1010543', 'To Sir With Love', 'Drama', 'Braithwaite', '1124', '12.49','23');




-- insert into books values ('1010654', 'Harry Potter and the Philosophers Stone', 'Fantasy', 'J.K Rowling', '1234', '45.50','12');
-- insert into books values ('1010765', 'Harry Potter and the Philosophers Stone', 'Fantasy', 'J.K Rowling', '1234', '45.50','12');
-- insert into books values ('1010987', 'Harry Potter and the Philosophers Stone', 'Fantasy', 'J.K Rowling', '1234', '45.50','12');
-- insert into books values ('1010876', 'Harry Potter and the Philosophers Stone', 'Fantasy', 'J.K Rowling', '1234', '45.50','12');
-- insert into books values ('1010587', 'Harry Potter and the Philosophers Stone', 'Fantasy', 'J.K Rowling', '1234', '45.50','12');
-- insert into books values ('1010098', 'Harry Potter and the Philosophers Stone', 'Fantasy', 'J.K Rowling', '1234', '45.50','12');
-- insert into books values ('1010498', 'Harry Potter and the Philosophers Stone', 'Fantasy', 'J.K Rowling', '1234', '45.50','12');
-- insert into books values ('1010389', 'Harry Potter and the Philosophers Stone', 'Fantasy', 'J.K Rowling', '1234', '45.50','12');
-- insert into books values ('1010711', 'Harry Potter and the Philosophers Stone', 'Fantasy', 'J.K Rowling', '1234', '45.50','12');

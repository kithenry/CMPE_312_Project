#### some of these are already implemented and some are not

- [x]  User should be able to add new books to page
- [x]  User book view (go to some page to look at a book's details)
- [x]  Image feature for books (User should be able to add image of book they are putting up for sale on library)
- [-]  User should be able to indicate in text which book they would exchange what they have for 
- [x]  Book card should include brief posted by details, and chat option
        - [x] image of book
        - [x] name of book
        - [x] course book is related to 
        - [x] available exchange methods (cash or barter)
        - [ ] posted by details lead to the poster's profile
        - [ ] chat option leads to a chat linked to the book and creates a transaction for that book
        - [x] view entry leads to book detais: which has all the above and option to open transaction chat
        - [ ] chat by default opens transaction about a book
- [x]  Transaction when clicked should lead to a page with entries to manage transaction
        - [x] Chat related to transaction
        - [x] Transaction status change (depending on if user is buyer or seller in transaction)
        - [x] Cancel transaction
- [ ]  .edu.tr. email enforcing
- [x]  dynamic rendering of login, register, logout links
- [x]  constraining search to logged in users
        - [ ] logged out users can only view the 3 books at the front which on trying to interact with them, they have to login
- [x]  User should be able to view and edit their profile
- [ ]  User should be able to rank seller after transaction is complete (stars, which would become some trust score)
- [ ]  Polishing Design


#### same with these for the api

- [ ] api must provide profile view endpoint
- [ ] api must provide transaction management business logic

#### extras
- [ ] book description section
- [ ] book ratings calculation
- [ ] related books 
- [ ] book quantity not updated when book transaction is cancelled
- [ ] transaction list not updated when book quantity is updated 

var db = require('../utils/connection');

module.exports = {
    getUsersEmail: "SELECT * FROM users WHERE email = ?",
    insertUserData : "insert into users SET ?",
    updateStatus : "update users SET is_email_verify=1 where email=?",
    updatepassword : "update users SET password=? where email=?",
    updateUser : "Update users SET ? where email=?",    
    getCountry : "Select id,name,code from country order by name",
    getUserProfile : "SELECT * FROM users WHERE email = ?",
    getPassword : "Select password from users where email =?",
    updateAccount : "Update users SET deactivate_account=1 where email=?",
    updateProfile : "update users SET profile_pic=? where email=?",
    getProfile :  "Select profile_pic from users where email=?",
    getProduct : "SELECT * FROM item ORDER BY id DESC LIMIT 12",
    getAllProductQry : "SELECT * FROM item WHERE type = ? ORDER BY id DESC LIMIT 12",
    getNftDetails : "SELECT item_category.name as category_name, item.*, DATE_FORMAT(item.datetime, '%d-%m-%Y') as createdDate FROM item LEFT JOIN item_category ON item.item_category_id = item_category.id WHERE item.id = ?",

    getWishList : "SELECT * FROM wish_list WHERE user_id = ? AND product_id = ? ",
    addWishlist : "insert into wish_list SET ?",
    getWishlist : "SELECT item.*, wish_list.user_id, wish_list.id as wishlist_id, item_category.name as category_name FROM wish_list LEFT JOIN item ON wish_list.product_id = item.id LEFT JOIN item_category ON item.item_category_id = item_category.id WHERE wish_list.user_id = ?  ORDER BY wish_list.id DESC",

    deleteWishlistitem : "DELETE FROM wish_list WHERE id = ?",
    getWishlistNftQry:"SELECT * FROM wish_list WHERE product_id = ?",
    categoryDetail : "SELECT item.item_category_id , item_category.name FROM item INNER JOIN item_category ON item_category.id = item.item_category_id GROUP BY item.item_category_id",
    addTransaction : "insert into transaction SET ?",
    getTransactionsQry : "SELECT * FROM transaction WHERE user_id = ?",
    buyItem:"UPDATE item SET ? WHERE id = ?",
    orderForBuyItem:"Insert INTO orders SET ?",
    getAllOrder : "SELECT i.image,i.price,i.name,i.token_id,i.owner_id,o.* FROM `orders` as o LEFT JOIN item as i ON i.id=o.item_id WHERE o.user_id= ? ORDER BY o.id DESC",

    getOrderDetails : "SELECT i.image,i.description,i.owner, i.price,i.name,i.token_id,i.owner_id,o.* FROM `orders` as o LEFT JOIN item as i ON i.id=o.item_id WHERE o.id= ?",

     insertContacts  : "insert into contact_us SET ?",
    getContact   : "Select * from contact_us"
 

}
var express = require('express');
var path = require('path');
var router = express.Router();
var nodemailer = require('nodemailer');
var cron = require('node-cron');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
const CLIENT_ID = '139932409549-jdaqdpk9i7r2cfnus55ir46tl14fmbm4.apps.googleusercontent.com';
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/homepage.html');
});

//------------------------------------------------------------------------------

router.get('/getBranches', function (req, res, next) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }

    var query = "SELECT b.id, b.branch_name, b.branch_image, b.manager_ids, GROUP_CONCAT(u.email) AS branch_members FROM branches b LEFT JOIN branch_user bu ON b.id = bu.branch_id LEFT JOIN user u ON bu.user_email = u.email GROUP BY b.id, b.branch_name, b.branch_image, b.manager_ids;";
    connection.query(query, function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }

      const result = rows.map(row => ({ id: row.id, name: row.branch_name, image: row.branch_image, managers: row.manager_ids, members: row.branch_members }));

      res.json(result);
    });
  });
});

//------------------------------------------------------------------------------

router.get('/getEvents', function (req, res, next) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }

    var query = "SELECT ed.eventid, ed.event_name, ed.event_image, ed.event_description, ed.event_date, ed.event_public, e.branchid FROM event_details ed INNER JOIN events e ON ed.eventid = e.eventid;";
    connection.query(query, function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }

      const result = rows.map(row => ({
        eventId: row.eventid,
        branchId: row.branchid,
        name: row.event_name,
        image: row.event_image,
        info: row.event_description,
        date: row.event_date,
        public: row.event_public
      }));

      res.json(result);
    });
  });
});

router.get('/getMyEvents', function (req, res, next) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }

    var user = req.query.user;

    var query = "SELECT ed.eventid, ed.event_name, ed.event_image, ed.event_description, ed.event_date, ed.event_public, e.user_email FROM event_details ed INNER JOIN event_rsvp e ON ed.eventid = e.event_id WHERE e.user_email = ?;";
    connection.query(query, [user], function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }

      const result = rows.map(row => ({
        eventId: row.eventid,
        user: row.user_email,
        name: row.event_name,
        image: row.event_image,
        info: row.event_description,
        date: row.event_date,
        public: row.event_public
      }));

      console.log("get my events: ")

      console.log(result);

      res.json(result);
    });
  });
});

//------------------------------------------------------------------------------

router.get('/getAnnouncements', function (req, res, next) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }

    var query = "SELECT an.title, an.content, an.date, an.public, an.announcement_id, a.branch_id FROM announcement_details an INNER JOIN announcements a ON an.announcement_id = a.announcement_id;";
    connection.query(query, function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }

      const result = rows.map(row => ({
        title: row.title,
        content: row.content,
        date: row.date,
        public: row.public,
        announcementId: row.announcement_id,
        branchId: row.branch_id
      }));

      res.json(result);
    });
  });
});

//------------------------------------------------------------------------------

router.post('/addEvent', function (req, res, next) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }

    var branchid = req.body.branchid;
    var eventName = req.body.eventName;
    var eventInfo = req.body.eventInfo;
    var eventImage = req.body.eventImage;
    var eventDate = req.body.eventDate;
    var eventPublic = req.body.eventPublic;

    var query1 = "INSERT INTO events (branchid) VALUES (?)";
    connection.query(query1, [branchid], function (err, result1) {
      if (err) {
        connection.release();
        res.sendStatus(500);
        return;
      }

      var eventid = result1.insertId;

      var query2 = "INSERT INTO event_details (eventid, event_name, event_description, event_image, event_date, event_public) VALUES (?, ?, ?, ?, ?, ?)";
      connection.query(query2, [eventid, eventName, eventInfo, eventImage, eventDate, eventPublic], function (err, result2) {
        connection.release();
        if (err) {
          res.sendStatus(500);
          return;
        }

        res.sendStatus(200);
      });
    });
  });
});

//------------------------------------------------------------------------------

router.post('/addAnnouncement', function (req, res, next) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }

    var branchid = req.body.branchid;
    var announcementTitle = req.body.announcementTitle;
    var announcementContent = req.body.announcementContent;
    var announcementDate = req.body.announcementDate;
    var announcementPublic = req.body.announcementPublic;


    var query1 = "INSERT INTO announcements (branch_id) VALUES (?)";
    connection.query(query1, [branchid], function (err, result1) {
      if (err) {
        connection.release();
        res.sendStatus(500);
        return;
      }

      var announcementid = result1.insertId;

      var query2 = "INSERT INTO announcement_details (announcement_id, title, content, date, public) VALUES (?, ?, ?, ?, ?)";
      connection.query(query2, [announcementid, announcementTitle, announcementContent, announcementDate, announcementPublic], function (err, result2) {
        connection.release();
        if (err) {
          res.sendStatus(500);
          return;
        }

        res.sendStatus(200);
      });
    });
  });
});

//------------------------------------------------------------------------------

router.post('/removeEvent', function (req, res, next) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }

    var eventId = req.body.id;

    var query1 = "DELETE FROM event_details WHERE eventid = ?;";
    connection.query(query1, [eventId], function (err, result2) {
      if (err) {
        connection.release();
        res.sendStatus(500);
        return;
      }

      var query2 = "DELETE FROM events WHERE eventid = ?;";
      connection.query(query2, [eventId], function (err, result1) {
        connection.release();
        if (err) {
          res.sendStatus(500);
          return;
        }

        res.sendStatus(200);
      });
    });
  });
});

//------------------------------------------------------------------------------

router.post('/login', function (req, res, next) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }

    var email = req.body.email;
    var password = req.body.password;
    var query = `
    SELECT u.*, ut.UserType, b.id as BranchID, b.branch_name as BranchName
    FROM user u
    JOIN UserType ut ON u.UserTypeID = ut.UserTypeID
    LEFT JOIN branches b ON FIND_IN_SET(u.UserID, b.manager_ids)
    WHERE u.email = ?;
    `;
    connection.query(query, [email, password], function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      if (rows.length > 0) {
        const userData = rows[0];
        bcrypt.compare(password, userData.password, function (err, result) {
          if (result) {
            req.session.user = {
              userID: userData.UserID,
              email: userData.email,
              userType: userData.UserType,
              branchID: userData.BranchID || null,
              branchName: userData.BranchName || null
            };

            res.status(200).send({
              userType: userData.UserType,
              branchID: userData.BranchID || null,
              branchName: userData.BranchName || null,
              email: userData.email
            });
          } else {
            console.log('incorrect password');
            res.sendStatus(401);
          }
        });
      }
      else {
        console.log('incorrect email');
        res.sendStatus(401);
      }
    });
  });
});
//------------------------------------------------------------------------------
router.post('/google-login', async function (req, res, next) {
  if ('client_id' in req.body && 'credential' in req.body) {

    console.log(req.body)
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    //console.log(payload['sub']);
    console.log(payload['email']);
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    req.pool.getConnection(function (cerr, connection) {
      if (cerr) {
        res.sendStatus(500);
        return;
      }

      let query = "SELECT UserID, email, givenName, lastName, UserTypeID, subscriptions FROM user WHERE email = ?";

      connection.query(query, [payload['email']], function (qerr, rows, fields) {

        connection.release();

        if (qerr) {
          res.sendStatus(500);
          return;
        }

        console.log(JSON.stringify(rows));

        if (rows.length > 0) {
          // There is a user
          [req.session.user] = rows;

          res.json(req.session.user);


        } else {
          // No user
          res.sendStatus(401);
        }

      });

    });


  }
});

//------------------------------------------------------------------------------

const saltRounds = 10;
router.post('/signup', async function (req, res, next) {
  console.log(req.body)

  let isGoogleLogin = false, payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    payload = ticket.getPayload();
    isGoogleLogin = true
  } catch(err) {
    isGoogleLogin = false
  }
  //console.log(payload['sub']);
  let userEmail, userFirstName, userLastName, userPassword, userConfirmPassword;
  console.log(payload);
  if(isGoogleLogin) {
    userEmail =  payload.email;
    userFirstName = payload.given_name;
    userLastName = payload.family_name;
    userPassword = generateRadomString(10);
    userConfirmPassword = userPassword;
  }
  else {
    userEmail = req.body.email_val;
    userFirstName = req.body.firstName_val;
    userLastName = req.body.lastName_val;
    userPassword = req.body.password_val;
    userConfirmPassword = req.body.passwordVal;
  }
  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }

    // Validate input fields
    if (!userFirstName || !userLastName || !userEmail || (!isGoogleLogin && (!userPassword || !userConfirmPassword))) {
      console.log("here 1");
      res.sendStatus(400);
      return;
    }

    if (!isGoogleLogin && (userPassword !== userConfirmPassword)) {
      console.log("here 2");
      res.sendStatus(400);
      return;
    }

    if (!isGoogleLogin && (userPassword < 8)) {
      console.log("here 3");
      res.sendStatus(400);
      return;
    }

    const userRole = req.body.btnradio;
    let userTypeID;

    switch (userRole) {
      case '1':
        userTypeID = 1; // Member
        break;
      case '2':
        userTypeID = 2; // Manager
        break;
      case '3':
        userTypeID = 3; // System Admin
        break;
      default:
        userTypeID = 1;
    }

    bcrypt.hash(userPassword, saltRounds, function (err, hash) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }

      if (userTypeID === 2) { // Manager
        // Insert the manager into the pending_requests table
        const insertQuery = "INSERT INTO `pending_requests` (email, first_name, last_name, password, user_type) VALUES (?, ?, ?, ?, ?)";
        const values = [userEmail, userFirstName, userLastName, hash, 'Manager'];

        connection.query(insertQuery, values, function (error, result) {
          connection.release();
          if (error) {
            console.error(error);
            res.sendStatus(500);
            return;
          }

          res.sendStatus(200);
        });
      } else if (userTypeID === 3) { // System Admin
        // Insert the system admin into the system_admins table
        const insertQuery = "INSERT INTO `pending_requests` (email, first_name, last_name, password, user_type) VALUES (?, ?, ?, ?, ?)";
        const values = [userEmail, userFirstName, userLastName, hash, 'System Admin'];

        connection.query(insertQuery, values, function (error, result) {
          connection.release();
          if (error) {
            console.error(error);
            res.sendStatus(500);
            return;
          }

          res.sendStatus(200);
        });
      } else {
        console.log('reaches else code')
        // Insert the new user into the database with the hashed password
        const query = "INSERT INTO `user` (email, givenName, lastName, password, UserTypeID) VALUES (?, ?, ?, ?, ?)";
        const values = [userEmail, userFirstName, userLastName, hash, userTypeID];

        connection.query(query, values, function (error, result) {
          connection.release();
          if (error) {
            console.error(error);
            res.sendStatus(500);
            return;
          }

          res.redirect("/login.html");
        });
      }
    });
  });
});

//------------------------------------------------------------------------------

router.get('/pending-requests', function (req, res, next) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }

    // Fetch pending requests from the pending_requests table
    const query = "SELECT * FROM `pending_requests`";
    connection.query(query, function (error, results) {
      connection.release();
      if (error) {
        console.error("Error querying pending requests:", error);
        res.sendStatus(500);
        return;
      }

      console.log("Pending requests:", results); // Log the fetched requests
      res.json(results);
    });
  });
});


//------------------------------------------------------------------------------

router.post('/approve-request/:requestId', function (req, res, next) {
  const requestId = req.params.requestId;
  const branchId = req.body.branchId;

  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }

    connection.beginTransaction(function (err) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        connection.release();
        return;
      }

      // Check the user_type for the request
      const checkUserTypeQuery = `
        SELECT user_type
        FROM pending_requests
        WHERE request_id = ?
      `;

      connection.query(checkUserTypeQuery, [requestId], function (error, results) {
        if (error) {
          connection.rollback(function () {
            console.error(error);
            res.sendStatus(500);
            connection.release();
          });
          return;
        }

        const userType = results[0].user_type;

        if (userType === 'System Admin') {
          // Handle System Admin request
          const insertSystemAdminQuery = `
            INSERT INTO user (email, givenName, lastName, password, UserTypeID)
            SELECT email, first_name, last_name, password, 3
            FROM pending_requests
            WHERE request_id = ?
          `;

          connection.query(insertSystemAdminQuery, [requestId], function (error, result) {
            if (error) {
              connection.rollback(function () {
                console.error(error);
                res.sendStatus(500);
                connection.release();
              });
              return;
            }

            const deleteQuery = `
              DELETE FROM pending_requests
              WHERE request_id = ?
            `;

            connection.query(deleteQuery, [requestId], function (error, result) {
              if (error) {
                connection.rollback(function () {
                  console.error(error);
                  res.sendStatus(500);
                  connection.release();
                });
                return;
              }

              connection.commit(function (err) {
                if (err) {
                  connection.rollback(function () {
                    console.error(err);
                    res.sendStatus(500);
                    connection.release();
                  });
                } else {
                  console.log('Transaction completed successfully');
                  connection.release();
                  res.sendStatus(200);
                }
              });
            });
          });
        } else {
          // Handle Manager request
          const transferQuery = `
            INSERT INTO user (email, givenName, lastName, password, UserTypeID)
            SELECT email, first_name, last_name, password, 2
            FROM pending_requests
            WHERE request_id = ?
          `;

          connection.query(transferQuery, [requestId], function (error, result) {
            if (error) {
              connection.rollback(function () {
                console.error(error);
                res.sendStatus(500);
                connection.release();
              });
              return;
            }

            const getEmailQuery = `
              SELECT email
              FROM pending_requests
              WHERE request_id = ?
            `;

            connection.query(getEmailQuery, [requestId], function (error, results) {
              if (error) {
                connection.rollback(function () {
                  console.error(error);
                  res.sendStatus(500);
                  connection.release();
                });
                return;
              }

              const userEmail = results[0].email;

              // Log to verify email and branchId before inserting into branch_managers
              console.log('Inserting into branch_managers with branchId:', branchId, 'and userEmail:', userEmail);

              const insertBranchUserQuery = `
                INSERT INTO branch_managers (branch_id, manager_email)
                VALUES (?, ?)
              `;

              connection.query(insertBranchUserQuery, [branchId, userEmail], function (error, result) {
                if (error) {
                  connection.rollback(function () {
                    console.error(error);
                    res.sendStatus(500);
                    connection.release();
                  });
                  return;
                }

                const deleteQuery = `
                  DELETE FROM pending_requests
                  WHERE request_id = ?
                `;

                connection.query(deleteQuery, [requestId], function (error, result) {
                  if (error) {
                    connection.rollback(function () {
                      console.error(error);
                      res.sendStatus(500);
                      connection.release();
                    });
                    return;
                  }

                  connection.commit(function (err) {
                    if (err) {
                      connection.rollback(function () {
                        console.error(err);
                        res.sendStatus(500);
                        connection.release();
                      });
                    } else {
                      console.log('Transaction completed successfully');
                      connection.release();
                      res.sendStatus(200);
                    }
                  });
                });
              });
            });
          });
        }
      });
    });
  });
});
//-------------------
router.delete('/deny-request/:requestId', (req, res) => {
  const requestId = req.params.requestId;

  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }

    const deleteQuery = "DELETE FROM `pending_requests` WHERE request_id = ?";
    connection.query(deleteQuery, [requestId], function (error, result) {
      connection.release();
      if (error) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});

//------------------------------------------------------------------------------

const db = mysql.createConnection({
  database: 'comp_coopdb'
});

db.connect(err => {
  if (err) {
    console.error('Failed to connect to the database:', err);
    return;
  }
  console.log('Connected to database successfully');
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'CompassionCoop1@gmail.com',
    pass: 'dhmg eqrt lkdg tupk'
  }
});

router.post('/send-email', function (req, res, next) {
  const userEmail = req.body.email;
  const selectedBranch = req.body.branch;

  let emailSubject = '';
  let emailContent = '';

  switch (selectedBranch) {
    case 'branch1':
      emailSubject = 'Welcome to Adelaide Hills Volunteers!';
      emailContent = `
        <h1>Welcome to Adelaide Hills Volunteers!</h1>
        <p>Dear Volunteer,</p>
        <p>Thank you for joining our Adelaide Hills branch! We're thrilled to have you on board. The Adelaide Hills region is known for its natural beauty and close-knit communities, and your contribution will make a real difference here.</p>
        <p>Some of our current initiatives include:</p>
        <ul>
          <li>Environmental conservation in local parks</li>
          <li>Community gardening projects</li>
          <li>Support for local festivals and events</li>
        </ul>
        <p>We'll be in touch soon with more details about upcoming opportunities. If you have any questions, feel free to reach out to us at CompassionCoop1@gmail.com.</p>
        <p>Together, we can make the Adelaide Hills an even better place to live!</p>
        <p>Best regards,<br>The Adelaide Hills Volunteer Team</p>
      `;
      break;

    case 'branch2':
      emailSubject = 'Join Us in Making a Difference in Port Willunga!';
      emailContent = `
        <h1>Welcome to Port Willunga Volunteers!</h1>
        <p>Dear Volunteer,</p>
        <p>We're excited to welcome you to our Port Willunga branch! Your commitment to volunteering will help us preserve the beauty of our coastal community and support our local residents.</p>
        <p>Our current focus areas include:</p>
        <ul>
          <li>Beach clean-up and marine life protection</li>
          <li>Assisting elderly residents with daily tasks</li>
          <li>Supporting local tourism initiatives</li>
        </ul>
        <p>We'll contact you soon about our next volunteer meeting. If you need any information, please email us at CompassionCoop1@gmail.com.</p>
        <p>Your dedication will help keep Port Willunga a paradise for residents and visitors alike!</p>
        <p>Warm regards,<br>Port Willunga Volunteer Coordinators</p>
      `;
      break;

    case 'branch3':
      emailSubject = 'Welcome to Barossa Volunteers - Let\'s Make a Difference!';
      emailContent = `
        <h1>Welcome to Barossa Volunteers!</h1>
        <p>Dear Volunteer,</p>
        <p>Welcome to the Barossa branch of our volunteer organization! We're delighted to have you join us in supporting our world-renowned wine region and its vibrant communities.</p>
        <p>Some of our ongoing projects include:</p>
        <ul>
          <li>Assisting at local wineries and cellar doors</li>
          <li>Supporting regional food and wine festivals</li>
          <li>Helping with heritage preservation efforts</li>
        </ul>
        <p>We'll be sending you information about our next orientation session soon. For any queries, please contact us at CompassionCoop1@gmail.com.</p>
        <p>Your commitment will help us maintain the Barossa's reputation as a top destination for food, wine, and community spirit!</p>
        <p>Cheers,<br>The Barossa Volunteer Team</p>
      `;
      break;

    case 'branch4':
      emailSubject = 'Welcome to Adelaide City Volunteers!';
      emailContent = `
        <h1>Welcome to Adelaide City Volunteers!</h1>
        <p>Dear Volunteer,</p>
        <p>We're thrilled to welcome you to our Adelaide City branch! Your dedication to volunteering will contribute to making our vibrant city an even better place to live, work, and visit.</p>
        <p>Our current volunteer opportunities include:</p>
        <ul>
          <li>Supporting local community centers and libraries</li>
          <li>Assisting at city-wide events and festivals</li>
          <li>Participating in urban greening initiatives</li>
        </ul>
        <p>We'll be in touch shortly with details about our upcoming volunteer orientation. If you have any questions, please email us at CompassionCoop1@gmail.com.</p>
        <p>Together, we can make a positive impact on Adelaide's diverse communities!</p>
        <p>Best wishes,<br>Adelaide City Volunteer Coordinators</p>
      `;
      break;

    default:
      res.status(400).send('Invalid branch selected');
      return;
  }

  transporter.sendMail({
    to: userEmail,
    subject: emailSubject,
    html: emailContent
  })
    .then(() => {
      const sql = `INSERT INTO EmailSubscribers (email, last_sent, branch) VALUES (?, CURDATE(), ?) ON DUPLICATE KEY UPDATE last_sent = CURDATE(), branch = ?`;
      db.query(sql, [userEmail, selectedBranch, selectedBranch], (err, result) => {
        if (err) {
          console.error('Database operation failed:', err);
          res.status(500).send('Database operation failed');
          return;
        }
        console.log('Email saved/updated in database');
        res.status(200).send('Email sent');
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error sending email');
    });
});

cron.schedule('0 0 * * *', () => {
  console.log('Running a task every day at midnight to check for email resends');
  const sql = `SELECT email FROM EmailSubscribers WHERE last_sent <= CURDATE() - INTERVAL 14 DAY`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Failed to fetch emails:', err);
      return;
    }
    results.forEach(subscriber => {
      transporter.sendMail({
        to: subscriber.email,
        subject: 'Compassion Coop: Your Quarterly Update',
        html: `
    <h1>Compassion Coop: Making a Difference Together</h1>

    <p>Dear Valued Volunteer,</p>

    <p>We hope this message finds you well. It's time for your quarterly update from Compassion Coop! We're excited to share our recent achievements and upcoming initiatives across all our branches.</p>

    <h2>Recent Highlights</h2>
    <ul>
      <li>Our Adelaide Hills branch successfully completed a major reforestation project, planting over 1,000 native trees.</li>
      <li>Port Willunga volunteers organized a series of beach clean-ups, removing over 500kg of waste from our beautiful coastline.</li>
      <li>The Barossa team supported the annual wine festival, contributing over 500 volunteer hours to ensure its success.</li>
      <li>Our Adelaide City branch launched a new mentoring program, connecting senior volunteers with at-risk youth.</li>
    </ul>

    <h2>Upcoming Events</h2>
    <ul>
      <li>Annual Volunteer Appreciation Day: Join us on [date] to celebrate your incredible contributions!</li>
      <li>Cross-Branch Environmental Workshop: Learn about sustainable practices you can implement in your community.</li>
      <li>Compassion Coop Charity Run: Get ready for our biggest fundraising event of the year, happening next month.</li>
    </ul>

    <h2>Volunteer Spotlight</h2>
    <p>This quarter, we're recognizing Sarah Thompson from our Port Willunga branch for her outstanding dedication to marine conservation efforts. Sarah has logged over 200 hours this year alone. Thank you, Sarah, for your inspiring commitment!</p>

    <h2>How You Can Help</h2>
    <p>We're always looking for volunteers to help with our ongoing projects. Whether you have a few hours or a few days to spare, every contribution makes a difference. Check our website or contact your local branch coordinator for current opportunities.</p>

    <p>Remember, your efforts are making South Australia a better place, one act of kindness at a time. Thank you for being part of the Compassion Coop family!</p>

    <p>Warm regards,<br>
    The Compassion Coop Team</p>

    <p><small>To update your email preferences or unsubscribe, please visit our <a href="#">subscription management page</a>.</small></p>
  `
      }, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
          const updateSql = `UPDATE EmailSubscribers SET last_sent = CURDATE() WHERE email = ?`;
          db.query(updateSql, [subscriber.email], (updateErr, updateResults) => {
            if (updateErr) {
              console.log('Error updating last sent date:', updateErr);
            } else {
              console.log('Last sent date updated for:', subscriber.email);
            }
          });
        }
      });
    });
  });
});

//------------------------------------------------------------------------------

router.post('/updateProfile', function (req, res, next) {
  if (!req.session.user || !req.session.user.userID) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const userId = req.session.user.userID;
  const updates = req.body;

  if (!userId) {
    res.status(400).json({ success: false, message: 'No userId provided' });
    return;
  }

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ success: false, message: 'No updates provided' });
    return;
  }

  req.pool.getConnection(function (error, connection) {
    if (error) {
      console.error('Error getting connection:', error);
      res.sendStatus(500);
      return;
    }

    let updateQuery = 'UPDATE user SET ';
    let queryValues = [];

    for (let field in updates) {
      if (field !== 'userId') {
        if (field === 'subscriptions') {
          try {
            updates[field] = JSON.stringify(JSON.parse(updates[field]));
          } catch (jsonError) {
            console.error('Invalid JSON for subscriptions:', updates[field]);
            res.status(400).json({ success: false, message: 'Invalid JSON for subscriptions' });
            return;
          }
        }

        if (field === 'password') {
          // Handle password update with hashing
          bcrypt.hash(updates[field], saltRounds, function (err, hash) {
            if (err) {
              console.error(err);
              res.sendStatus(500);
              return;
            }
            updateQuery += `${field} = ?, `;
            queryValues.push(hash); // Push hashed password

            // Move the execution of executeUpdateQuery inside the bcrypt.hash callback
            executeUpdateQuery(updateQuery, queryValues, connection, req, res, userId);
          });
        } else {
          updateQuery += `${field} = ?, `;
          queryValues.push(updates[field]);
        }
      }
    }

    // If no password change, execute query immediately
    if (!updates.hasOwnProperty('password')) {
      executeUpdateQuery(updateQuery, queryValues, connection, req, res, userId);
    }
  });
});

function executeUpdateQuery(updateQuery, queryValues, connection, req, res, userId) {
  updateQuery = updateQuery.slice(0, -2); // Remove the last comma
  updateQuery += ' WHERE UserID = ?';
  queryValues.push(userId);

  console.log('Executing query:', updateQuery, 'with values:', queryValues);

  connection.query(updateQuery, queryValues, (err, result) => {
    connection.release();
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: err.message });
      return;
    }
    if (result.affectedRows === 0) {
      console.log('No rows updated');
      res.status(400).json({ success: false, message: 'No rows updated' });
      return;
    }
    res.json({ success: true, message: 'Profile updated successfully' });
  });
}

//------------------------------------------------------------------------------

router.post('/addMember', function (req, res, next) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }

    var member = req.body.member;
    var branchid = req.body.branchid;

    var query1 = "INSERT INTO branch_user (branch_id, user_email) VALUES (?, ?);";
    connection.query(query1, [branchid, member], function (err, result2) {
      if (err) {
        connection.release();
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});

router.post('/removeMember', function (req, res, next) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }

    var userid = req.body.userid;
    var branchid = req.body.branchid;


    var query1 = `DELETE FROM branch_user WHERE user_email = ? AND branch_id = ?;`
    connection.query(query1, [userid, branchid], function (err, result2) {
      if (err) {
        connection.release();
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});

router.post('/eventRSVP', function (req, res, next) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }

    var eventid = req.body.eventid;
    var userid = req.body.userid;

    // Check if the combination of eventid and userid already exists
    var checkQuery = `SELECT COUNT(*) AS count FROM event_rsvp WHERE event_id = ? AND user_email = ?;`;

    connection.query(checkQuery, [eventid, userid], function (err, rows) {
      if (err) {
        connection.release();
        res.sendStatus(500);
        return;
      }

      var count = rows[0].count;

      if (count > 0) {
        // If the combination already exists, delete the entry
        var deleteQuery = `DELETE FROM event_rsvp WHERE event_id = ? AND user_email = ?;`;

        connection.query(deleteQuery, [eventid, userid], function (err, result) {
          connection.release();
          if (err) {
            res.sendStatus(500);
            return;
          }

          res.sendStatus(200);
        });
      } else {
        // If the combination doesn't exist, insert a new entry
        var insertQuery = `INSERT INTO event_rsvp (event_id, user_email) VALUES (?, ?);`;

        connection.query(insertQuery, [eventid, userid], function (err, result) {
          connection.release();
          if (err) {
            res.sendStatus(500);
            return;
          }

          res.sendStatus(200);
        });
      }
    });
  });
});

router.post('/removeAnnouncement', function (req, res, next) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }

    var announcementid = req.body.announcementid;


    var query1 = `DELETE FROM announcement_details WHERE announcement_id = ?;`
    connection.query(query1, [announcementid], function (err, result1) {
      if (err) {
        connection.release();
        res.sendStatus(500);
        return;
      }

      var query2 = `DELETE FROM announcements WHERE announcement_id = ?;`
      connection.query(query2, [announcementid], function (err, result2) {
        if (err) {
          connection.release();
          res.sendStatus(500);
          return;
        }

        res.sendStatus(200);
      });
    });
  });
});

router.get('/getMembers', function (req, res, next) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }
    const branchId = req.query.branch_id;

    var query = "SELECT u.* FROM user u INNER JOIN branch_user bu ON u.email = bu.user_email WHERE bu.branch_id = ?;";
    connection.query(query, [branchId], function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }

      const result = rows.map(row => ({
        userid: row.UserID,
        email: row.email,
        firstname: row.givenName,
        lastname: row.lastName,
      }));

      res.json(result);
    });
  });
});

router.get('/getManager', function (req, res, next) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }
    const branchId = req.query.branch_id;
    const user_email = req.query.user_email;


    var query = `SELECT EXISTS (    SELECT 1    FROM branch_managers    WHERE manager_email = ? AND branch_id = ?) AS exists_in_branch_manager;`;
    connection.query(query, [user_email, branchId], function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      const result = rows[0].exists_in_branch_manager;
      console.log(rows);

      res.json(result);
    });
  });
});

router.get('/getAdmin', function (req, res, next) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }

    const user_email = req.query.user_email;


    var query = `SELECT EXISTS (    SELECT 1    FROM user    WHERE email = ? AND UserTypeID = 3) AS exists_in_branch_admin;`;
    connection.query(query, [user_email], function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      const result = rows[0].exists_in_branch_admin;

      res.json(result);
    });
  });
});

router.get('/getRSVP', function (req, res, next) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }

    const eventID = req.query.eventID;
    console.log(eventID);


    var query = "SELECT u.*, e.event_id FROM user u INNER JOIN event_rsvp e ON u.email = e.user_email WHERE event_id = ?;";
    connection.query(query, [eventID], function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }

      const result = rows.map(row => ({
        email: row.email,
        event_id: row.event_id,
        givenName: row.givenName,
        lastName: row.lastName,
      }));

      res.json(result);
    });
  });
});


function generateRadomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}


module.exports = router;
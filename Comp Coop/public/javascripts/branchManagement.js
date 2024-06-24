/* global Vue */
const vueinstBranchManagement = new Vue({
    el: '#branchManagement',
    data: {
        events: [],
        myevents: [],
        selectedBranch: JSON.parse(localStorage.getItem('selectedBranch')),
        currentElement: null,
        announcements: [],
        members: [],
        branches: [],
        email: localStorage.getItem('email'),
        announcementTitle:'',
        announcementContent:'',
        announcementDate:'',
        announcementPublic:'',
        eventRSVPList: [],
        manager: 0,
        member: 0,
        admin: 0,
    },
    created() {
        const queryString = window.location.search;

        // Parse the query string to extract parameters
        const urlParams = new URLSearchParams(queryString);

        // Access the value of each parameter
        this.currentEventID = urlParams.get('eventID') || '';



    },
    mounted() {
        const branchID = this.selectedBranch.id;
        const userEmail = this.email;


        fetch(`http://localhost:8080/getMembers?branch_id=${branchID}`)
            .then(res => res.json())
            .then(data => {
                // Assuming `data` contains the members array
                this.members = data;
                let found = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].email === this.email) {
                        found = true;
                        break;
                    }
                }
                this.member = found ? 1 : 0;
            });

        fetch(`http://localhost:8080/getManager?branch_id=${branchID}&user_email=${userEmail}`)
            .then((res) => res.json())
            .then(data => this.manager = data);

        fetch(`http://localhost:8080/getAdmin?user_email=${userEmail}`)
            .then((res) => res.json())
            .then(data => this.admin = data);

        fetch('http://localhost:8080/getAnnouncements')
            .then((res) => res.json())
            .then(data => this.announcements = data);

        fetch('http://localhost:8080/getEvents')
            .then((res) => res.json())
            .then(data => this.events = data);

        fetch(`http://localhost:8080/getMyEvents?user=${this.email}`)
            .then((res) => res.json())
            .then(data => this.myevents = data);


        fetch('http://localhost:8080/getBranches')
            .then((res) => res.json())
            .then(data => this.branches = data)
            .then(data => localStorage.setItem('branchData',data));

        fetch(`http://localhost:8080/getRSVP?eventID=${this.currentEventID}`)
            .then((res) => res.json())
            .then(data => this.eventRSVPList = data);

    },
    methods: {
        removeEvent(eventid) {
            removeEvent(eventid);
        },
        toggleElement(element) {
            this.currentElement = element;
        },
        storeBranchInfo(branch) {
            localStorage.setItem('selectedBranch', JSON.stringify(branch));
        },
        visitBranch(branch) {
            localStorage.setItem('selectedBranch', JSON.stringify(branch));
            window.location.href = 'http://localhost:8080/branch.html';
        },
        joinBranch() {
            if(this.email === null){
                window.location.href = 'http://localhost:8080/login.html';
            }else{
                addMember(this.email, this.selectedBranch.id);
            }

        },
        formatDate(dateString) {
            // Create a Date object from the ISO 8601 formatted string
            let date = new Date(dateString);
            // Format the date to a readable format
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long',  year: 'numeric' });
          },


        addNewAnnouncement(){
            if (this.announcementPublic != true){
                this.announcementPublic = false;
            }
            fetch("http://localhost:8080/addAnnouncement", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    branchid: this.selectedBranch.id,
                    announcementTitle: this.announcementTitle,
                    announcementContent: this.announcementContent,
                    announcementDate: this.announcementDate,
                    announcementPublic: this.announcementPublic
                })
            });

            location.reload();
        },

        removeMember(id){
            if (id === null){
                id = this.email;
            }
            axios.post('http://localhost:8080/removeMember', {
                branchid: this.selectedBranch.id,
                userid: id,
            });
            location.reload();
        },

        noAnnouncements(){
            for (let item of this.announcements){
                if(((this.selectedBranch.id === item.branchId) && (this.member || item.public)) || (this.manager || this.admin)){
                    return 0;
                }
            }
            return 1;
        },

        noEvents(){
            for (let item of this.events){
                if(((this.selectedBranch.id === item.branchId) && (this.member || item.public)) || (this.manager || this.admin)){
                    return 0;
                }
            }
            return 1;
        },

        eventRSVP(id){
            if (localStorage.getItem('email') === null){
                window.location.href = ("http://localhost:8080/login.html");
            }else{
                axios.post('http://localhost:8080/eventRSVP', {
                    eventid: id,
                    userid: localStorage.getItem('email'),
                });
                location.reload();

            }
            },

        removeAnnouncement(id){
            axios.post('http://localhost:8080/removeAnnouncement', {
                branchid: this.selectedBranch.id,
                announcementid: id,
            });
            location.reload();
        },

        eventAttendeesPage(eventid) {
            location.href = (`http://localhost:8080/eventAttendees.html?eventID=${eventid}`);
        },

        goingBool(eventId) {
            for (let item of this.myevents) {
                if (item.eventId === eventId) { // Assuming myEvents is an array of event IDs
                    return true;
                }
            }
            return false;
        },

        memberBool(id) {
            if (id !== null) {
                for (let item of this.branches) {
                    if (item.id == id) {  // Use item.id instead of this.branches.id
                        if (item.members !== null){
                            for (let item2 of item.members) {
                                if (item2 === this.email) {  // Check item2 directly
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;
        }

    }
});

function addNewAnnouncement(announcementTitle, announcementContent, announcementDate, announcementPublic) {
    if (announcementPublic != 1 ||announcementPublic != true){
        announcementPublic = 0;
    }
    let xhttp = new XMLHttpRequest();
    let announcementData = {
        branchid: JSON.parse(localStorage.getItem('selectedBranch')).id,
        announcementTitle: announcementTitle,
        announcementContent: announcementContent,
        announcementDate: announcementDate,
        announcementPublic: announcementPublic,
    };

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                const ANNOUNCEMENTLIST = JSON.parse(localStorage.getItem('ANNOUNCEMENTLIST'));
                ANNOUNCEMENTLIST.push({
                    branchid: JSON.parse(localStorage.getItem('selectedBranch')).id,
                    announcementTitle: announcementTitle,
                    announcementContent: announcementContent,
                    announcementDate: announcementDate,
                    announcementPublic: announcementPublic,
                });
                localStorage.setItem('ANNOUNCEMENTLIST', JSON.stringify(ANNOUNCEMENTLIST));
                location.reload();
            }
        }
    };

    xhttp.open("POST", "/addAnnouncement");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(announcementData));
    location.reload();
}

function addNewEvent(eventName, eventInfo, eventImage, eventDate, eventPublic) {
    var eventImage1;
    if(eventImage == '' || eventImage === null){
        eventImage1 = "/images/default-event.jpg";
    }else{
        eventImage1 = eventImage;
    }

    let xhttp = new XMLHttpRequest();
    let eventData = {
        branchid: JSON.parse(localStorage.getItem('selectedBranch')).id,
        eventName: eventName,
        eventInfo: eventInfo,
        eventImage: eventImage1,
        eventDate: eventDate,
        eventPublic: eventPublic
    };


    xhttp.open("POST", "/addEvent");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(eventData));
    location.reload();
}

function removeEvent(eventid) {
    let events = { id: eventid };

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                // Request was successful, do something with the response if needed

                const EVENTLIST = JSON.parse(localStorage.getItem('EVENTLIST'));

                // Find the index of the item with the corresponding event ID
                const indexToRemove = EVENTLIST.findIndex(item => item.eventId === eventid);

                // If the event ID exists in the array, remove it
                if (indexToRemove !== -1) {
                    EVENTLIST.splice(indexToRemove, 1);
                }

                // Update the local storage with the modified EVENTLIST
                localStorage.setItem('EVENTLIST', JSON.stringify(EVENTLIST));

                // Reload the page
                location.reload();
            }
        }
    };

    xhttp.open("POST", "/removeEvent");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(events)); // Send the correct JSON format
    location.reload();
}


function addMember(email, selectedBranch) {
    if(email === null){
        window.location.href = ("http://localhost:8080/login.html");
    }else{
        let data = {
            member: email,
            branchid:selectedBranch
        };


        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    alert("Member Added");
                }else{
                    window.location.href = ("http://localhost:8080/login.html");
                }

            }
        };

        xhttp.open("POST", "/addMember");
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(data));
        location.reload();

    }



}

function branchInfo() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                const priorBranches = JSON.parse(this.responseText); // Parse the JSON response
                localStorage.setItem('branches', JSON.stringify(priorBranches)); // Store branch names in localStorage
                const branches = priorBranches.map(branch => ({ id: branch[0], name: branch[1], image: branch[2], managers: branch[3] }));

            }
            else if (this.status >= 400) {
                alert("Invalid Login");
            }
        }
    };
    xhttp.open("GET", "/branches");
    xhttp.send();

}

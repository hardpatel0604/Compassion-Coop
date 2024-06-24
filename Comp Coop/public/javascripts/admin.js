/* global Vue */
new Vue({
  el: '#req_div',
  data: {
    requests: []
  },
  created() {
    this.fetchPendingRequests();
  },
  methods: {
    fetchPendingRequests() {
      fetch('/pending-requests')
        .then(response => response.json())
        .then(data => {
          this.requests = data;
        })
        .catch(error => {
          console.error('Error fetching pending requests:', error);
        });
    },
    approveRequest(requestId, branchId) {
      if (!branchId) {
        alert('Please select a branch');
        return;
      }

      fetch(`/approve-request/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ branchId }) // Make sure branchId is included
      })
      .then(response => {
        if (response.ok) {
          // Remove the approved request from the list
          this.requests = this.requests.filter(request => request.request_id !== requestId);
          alert('Request approved successfully!');
        } else {
          alert('Failed to approve the request. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error approving request:', error);
        alert('An error occurred while approving the request. Please try again.');
      });
    },
    denyRequest(requestId) {
      fetch(`/deny-request/${requestId}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            // Remove the denied request from the list
            this.requests = this.requests.filter(request => request.request_id !== requestId);
            alert('Request denied successfully!');
          } else {
            alert('Failed to deny the request. Please try again.');
          }
        })
        .catch(error => {
          console.error('Error denying request:', error);
          alert('An error occurred while denying the request. Please try again.');
        });
    }
  }
});
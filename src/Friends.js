import React, { Component } from 'react'
import swal from 'sweetalert';

export class Friends extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            addfriendname: '',
            friendslist: [
                {id:1, name: 'Monica Geller' , favourite: true},
                {id:2, name: 'Ross Geller' , favourite: false},
                {id:3, name: 'Chandler Bing' , favourite: false}
            ],
            paginatedata: [],
        }
        this.currentpage = 1
        this.dataLimit = 4
        this.filterdata = this.state.friendslist
    }

    componentDidMount() {
        this.paginatedata()
    }

    filtertable(name) {
        if (name.length === 0) {
            this.setState({
                friendslist: this.filterdata
            })
            console.log('filter')
            this.filterpaginatedata()
        } else {
            var filterdata = []
            for (let i = 0 ; i <= this.filterdata.length-1 ; i++) {
                if (this.filterdata[i]['name'].toLowerCase().includes(name.toLowerCase())) {
                    filterdata.push(this.filterdata[i])
                }
            }
            this.setState({
                friendslist: filterdata,
            })
            this.paginatedata()
        }
    }

    paginatedata() {
        const startIndex = this.currentpage * this.dataLimit - this.dataLimit;
        const endIndex = startIndex + this.dataLimit;
        this.setState({
            paginatedata: this.state.friendslist.slice(startIndex, endIndex)
        })
    }

    filterpaginatedata() {
        const startIndex = this.currentpage * this.dataLimit - this.dataLimit;
        const endIndex = startIndex + this.dataLimit;
        this.setState({
            paginatedata: this.filterdata.slice(startIndex, endIndex)
        })
    }

    addfriend(e) {
        e.preventDefault();
        if (this.state.addfriendname.length !== 0) {
            var finalresponse = {id:this.state.friendslist.length + 1, name: this.state.addfriendname , favourite: false}
            this.setState({
                addfriendname : '',
                friendslist: [...this.state.friendslist, finalresponse],
            })
            this.filterdata = [...this.state.friendslist, finalresponse]
            this.filterpaginatedata()
        }
    }

    deletefriend(e,friend) {
        e.preventDefault();
        swal({
            title: "Are you sure?",
            text: "Are you sure that you want to delete this contact?",
            icon: "warning",
            dangerMode: true,
        })
        .then(willDelete => {
            if (willDelete) {
                for (let i = 0 ; i <= this.state.friendslist.length-1 ; i++) {
                    if (this.state.friendslist[i]['id'] === friend['id']) {
                        this.state.friendslist.splice(i, 1); 
                    }
                }
                this.setState({
                    friendslist: this.state.friendslist
                })
                this.paginatedata()
              swal("Deleted!", "Your contact has been deleted!", "success");
            }
        });
        
    }

    setfavourite(favourite,id) {
        for (let i = 0 ; i <= this.state.friendslist.length-1 ; i++) {
            if (this.state.friendslist[i]['id'] === id) {
                this.state.friendslist[i]['favourite'] = favourite
            }
        }
        this.state.friendslist.sort(function(a,b){return a['favourite']-b['favourite']}).reverse();
        this.setState({
            friendslist: this.state.friendslist
        })
        this.paginatedata()
    }

    previouspage(e,page) {
        e.preventDefault();
        if (page !== 1) {
            this.currentpage = this.currentpage - 1
            this.paginatedata()
        }
    }

    nextpage(e,page) {
        e.preventDefault();
        this.currentpage = this.currentpage + 1
        this.paginatedata()
    }
    
    render() {
        return (
            <div className="fl-container">
                <div className="fl-container-card">
                    <div className="card-header-fixed">
                        <span className="card-title">Friends</span>
                        <input type="text" className="custom-search" placeholder="Search" onChange={e => this.filtertable(e.target.value)} />
                    </div>
                    <div className="card-body-fixed">
                        <table id="friendtable" className="friendtable">
                            <tbody>
                                {this.state.paginatedata.map((value, index) => (
                                    <tr key={index+1}>
                                        <td><b>{value.name}</b><p>is your friend</p></td>
                                        <td><input type="checkbox" id="checkboxinlist" className="replacewithicon" checked={value.favourite} onClick={e => this.setfavourite(e.target.checked,value.id)}/></td>
                                        <td><input type="button" value="Delete" onClick={e => this.deletefriend(e,value)} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card-pagination-fixed">
                        <input type="button" value="Previous" disabled={this.currentpage === 1} onClick={e => this.previouspage(e,this.currentpage)} />
                                <p>currentpage : {this.currentpage}</p>
                        <input type="button" value="Next" onClick={e => this.nextpage(e,this.currentpage)} />
                    </div>
                    <div className="card-footer-fixed">
                        <form onSubmit={e => this.addfriend(e)}>
                            <input type="text" className="addfriend" placeholder="Add Friend"  value={this.state.addfriendname} onChange={e => this.setState({ addfriendname: e.target.value })} />
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Friends

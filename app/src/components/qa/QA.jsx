import React, { Component } from 'react'
import { InlineLoading, Button, Search, Modal, Tooltip } from 'carbon-components-react';
import { loadJSONData, abbreviateString } from "../helperfunctions/HelperFunctions"
import "./qa.css"



class Scene extends Component {
    constructor(props) {
        super(props)

        this.state = {
            apptitle: "Searcher",
            resultsList: [],
            loadingResults: false,
            maxResults: 5,
            selectedrow: 0,
        }

        this.solarServerPath = "http://localhost:8983/solr/"

    }
    componentDidUpdate(prevProps, prevState) {


    }


    componentDidMount() {
        this.apptitle = "Amadioha"
    }

    submitSearch(e) {
        this.setState({ selectedrow: 0 })
        console.log(this.refs["searchbox"].input.value)
        let inputValue = this.refs["searchbox"].input.value
        if (inputValue != "") {
            // let encodedText = encodeURIComponent("title:" + inputValue + " content:" + inputValue)
            let encodedText = encodeURIComponent("content:" + inputValue)

            // show loading
            this.setState({ loadingResults: true })
            this.setState({ resultsList: [] })

            let queryPath = this.solarServerPath + "newspaper/select?q=" + encodedText + "&rows=" + this.state.maxResults // title%3Anigeria"
            let loadedJSON = loadJSONData(queryPath)
            // console.log(similarityPath)    
            let self = this
            loadedJSON.then(function (data) {
                if (data) {
                    // console.log(data.response.docs)
                    self.setState({ resultsList: data.response.docs })
                    self.setState({ loadingResults: false })
                } else {
                    console.log("Solr Query failed")
                }
            })
        } else {
            return false

        }
    }

    searchKeyDown(e) {
        // console.log(e.keyCode)
        if (e.keyCode === 13) {
            this.submitSearch()
        }
    }

    clickResultRow(e) {
        this.setState({ selectedrow: e.target.getAttribute("indexvalue") })
        console.log(e.target)
    }


    render() {


        let resultList = this.state.resultsList.map((result, index) => {
            return (
                <div onClick={this.clickResultRow.bind(this)} key={"resultrow" + index} className={"mb5 resultrow clickable" + (this.state.selectedrow == index ? " active" : "")} indexvalue={index} >
                    <div indexvalue={index} className="boldtext resulttitle mb5"> {result.title}</div>
                    {(this.state.selectedrow != index) && <div indexvalue={index} className="lh10 resultcontent"> {abbreviateString(result.content[0], 200)}</div>}
                    {(this.state.selectedrow == index) && <div indexvalue={index} className="lh10 resultcontent scrollwindow scrollwindowresultrow"> {result.content[0]}</div>}
                </div>
            )
        });

        return (
            <div>

                <div className=" lh10 mb10">
                    {this.state.apptitle} is a natural language search tool
                    for querying information about Nigerian. It is powered by a dataset which includes information
                    from leading online news outlets across Nigeria.
                </div>

                <div className="flex">
                    <div className="flexfull mr10">
                        <Search
                            ref="searchbox"
                            id="searchbox"
                            labelText="Search"
                            defaultValue="Who is the Minister for Health in Nigeria"
                            placeHolderText="Enter your question e.g. When is the Nigerian Independence Day"
                            onKeyDown={this.searchKeyDown.bind(this)}
                        ></Search>
                    </div>
                    <div className="">
                        <Button
                            onClick={this.submitSearch.bind(this)}
                        > Submit </Button>
                    </div>
                </div>

                {this.state.resultsList.length > 0 &&
                    <div className="sectiontitle mb10 mt10"> Search Results </div>
                }

                {this.state.resultsList.length == 0 &&
                    <div className=" mb10 mt10"> No search results. Type in a search and hit enter. </div>
                }

                {this.state.loadingResults &&
                    <InlineLoading
                        description="loading search results .."
                    >

                    </InlineLoading>
                }

                <div className="mt10">
                    {resultList}
                </div>
            </div>
        )
    }
}

export default Scene
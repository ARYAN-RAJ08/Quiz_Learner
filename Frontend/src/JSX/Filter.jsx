import React from "react";
import { changeByClick } from "../JavaScript/Filter";

export default function Filter() {
    return (
        <>
            <div className="FilterMethod">
                <div className="FilterBySubject">
                    <div className="SubjectAndIcon" onClick={changeByClick}>
                        <div className="Name">Subject</div>
                        <i class="fa-solid fa-angle-down down"></i>
                    </div>
                    <div className="dataAndCheck">
                        <div className="data">
                            <input type="checkbox" className="ch" />
                            <span className="el">English</span>
                        </div>
                        <div className="data">
                            <input type="checkbox" className="ch" />
                            <span className="el">Math</span>
                        </div>
                        <div className="data">
                            <input type="checkbox" className="ch" />
                            <span className="el">Hindi</span>
                        </div>
                        <div className="data">
                            <input type="checkbox" className="ch" />
                            <span className="el">Physics</span>
                        </div>
                        <div className="data">
                            <input type="checkbox" className="ch" />
                            <span className="el">Chemistry</span>
                        </div>
                        <div className="data">
                            <input type="checkbox" className="ch" />
                            <span className="el">Biology</span>
                        </div>
                        <div className="data">
                            <input type="checkbox" className="ch" />
                            <span className="el">Computer(IT)</span>
                        </div>
                        <div className="data">
                            <input type="checkbox" className="ch" />
                            <span className="el">History</span>
                        </div>
                        <div className="data">
                            <input type="checkbox" className="ch" />
                            <span className="el">Geographhy</span>
                        </div>
                        <div className="data">
                            <input type="checkbox" className="ch" />
                            <span className="el">Civics</span>
                        </div>
                        <div className="data">
                            <input type="checkbox" className="ch" />
                            <span className="el">Economics</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
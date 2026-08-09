function MatchDetailSkeleton() {
    return (
        <div className="match-detail">
            <div className="match-detail-banner">
                <div className="skeleton skeleton-chip"></div>
                <div className="match-detail-teams">
                    <div className="match-detail-team">
                        <div className="skeleton skeleton-team-badge"></div>
                        <div className="skeleton skeleton-line"></div>
                    </div>
                    <div className="skeleton skeleton-score"></div>
                    <div className="match-detail-team">
                        <div className="skeleton skeleton-team-badge"></div>
                        <div className="skeleton skeleton-line"></div>
                    </div>
                </div>
            </div>

            <div className="match-detail-extra">
                <div className="skeleton skeleton-box"></div>
                <div className="skeleton skeleton-box"></div>
            </div>

            <div className="match-detail-rosters">
                <div className="skeleton skeleton-box-tall"></div>
                <div className="skeleton skeleton-box-tall"></div>
            </div>
        </div>
    )
}

export default MatchDetailSkeleton

import React from 'react'
import styled, { css } from 'styled-components'
import { localize } from 'components/localization'
import { Header } from 'components/elements'
import MacBook from 'images/svg/macbook.svg'
import device from 'themes/device.js'
import { isBrowser, deriv_app_url } from 'common/utility'
import { Button } from 'components/form'

const Container = styled.section`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 4rem;

    @media ${device.tabletL} {
        margin-top: 0;
        flex-direction: column-reverse;
        justify-content: center;
    }
`
const Tab = styled.div`
    width: 100%;
    margin-top: 2.4rem;
`
const TabsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 38.4rem;
    margin-top: 6rem;

    div:first-child {
        margin-top: 0;
    }
    @media ${device.tabletL} {
        flex-direction: column;
        justify-content: flex-start;
        margin-top: 0;
    }
`
const StepCommon = css`
    font-weight: 500;
    cursor: pointer;
    padding-left: 1.8rem;
    @media ${device.tabletL} {
        text-align: left;
        border: none;
        margin-top: ${(props) => (props.no_margin ? '0' : '2rem')};
    }
`
const Step = styled(Header)`
    ${StepCommon}
    margin-top: 0;
    ${(props) =>
        props.start_time < props.current_time && props.current_time < props.end_time
            ? 'color: var(--color-black-3); border-left: 4px solid var(--color-red)'
            : 'opacity: 0.2; border-left: 4px solid rgb(0, 0, 0, 0)'};
`

const VideoWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 49rem;

    @media ${device.mobileL} {
        height: 24rem;
        margin-top: 2rem;
    }
`
const MacbookFrame = styled(MacBook)`
    position: absolute;
    width: 100%;
    height: 100%;
`
const Video = styled.video`
    position: absolute;
    width: 77%;
    top: 5.5%;
    height: 77%;
    left: 11.5%;
`
const GoToLiveDemo = styled(Button)`
    border: 2px solid var(--color-red);
    font-weight: bold;
    line-height: 1.43;
    width: fit-content;
    margin-top: 4rem;

    @media ${device.tabletL} {
        max-width: 100%;
        margin: 4rem auto;
        font-size: 1.75rem;
    }
`

class DtraderTabs extends React.Component {
    my_ref = React.createRef()
    interval_ref = undefined
    state = {
        current_time: 0,
        progress_percentage: 0,
        transition: true,
        handler: 0,
        is_ios: true,
    }
    handler = async (entries) => {
        let entry
        for (entry of entries) {
            if (entry.isIntersecting) {
                if (!this.state.is_ios) {
                    this.updatePlay()
                }

                this.my_ref.current.ontimeupdate = () => {
                    if (this.my_ref.current) {
                        this.setState({
                            current_time: this.my_ref.current.currentTime,
                        })
                    }
                }
                this.progressHandler()
                this.interval_ref = window.setInterval(this.progressHandler, 300)
            } else {
                this.my_ref.current.pause()
                window.clearInterval(this.interval_ref)
            }
        }
    }
    observer = isBrowser() && new IntersectionObserver(this.handler)
    componentDidMount() {
        const node = this.my_ref.current
        this.updatePlay()
        this.observer.observe(node)

        const is_ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

        this.setState({ is_ios })
    }
    componentWillUnmount() {
        window.clearInterval(this.interval_ref)
        this.observer.disconnect()
    }

    updatePlay = async () => {
        if (!this.my_ref.current.is_playing) {
            try {
                await this.my_ref.current.play()
            } catch (err) {
                // eslint-disable-next-line no-console
                console.log(err)
            }
        }
    }
    componentDidUpdate(prev_props, prev_state) {
        if (this.state.transition === false) {
            requestAnimationFrame(() => {
                this.setState({
                    transition: true,
                })
            })
        }
        if (prev_state.handler !== this.state.handler) {
            this.updatePlay()
        }
    }
    clickHandler = (time) => {
        this.my_ref.current.currentTime = time
        this.my_ref.current.pause()
        this.setState({ transition: false, handler: time })
        this.progressHandler()
    }
    handleRedirect = () => {
        window.open(deriv_app_url, '_blank')
    }
    progressHandler = () => {
        this.setState({
            progress_percentage: Math.ceil(
                (this.my_ref.current.currentTime * 100) / this.my_ref.current.duration,
            ),
        })
    }
    render() {
        return (
            <Container>
                <TabsWrapper>
                    <Tab>
                        <Step
                            as="h4"
                            lh="1.5"
                            align="left"
                            no_margin
                            start_time={0}
                            end_time={7}
                            current_time={this.state.current_time}
                            onClick={() => this.clickHandler(0)}
                        >
                            {localize('1. Select your asset')}
                        </Step>
                    </Tab>
                    <Tab>
                        <Step
                            as="h4"
                            lh="1.5"
                            align="left"
                            start_time={7}
                            end_time={13}
                            current_time={this.state.current_time}
                            onClick={() => this.clickHandler(7)}
                        >
                            {localize('2. Follow the chart')}
                        </Step>
                    </Tab>
                    <Tab>
                        <Step
                            as="h4"
                            lh="1.5"
                            align="left"
                            start_time={13}
                            end_time={30}
                            current_time={this.state.current_time}
                            onClick={() => this.clickHandler(13)}
                        >
                            {localize('3. Purchase your option')}
                        </Step>
                    </Tab>
                    <GoToLiveDemo secondary="true" onClick={this.handleRedirect}>
                        {localize('Go to live demo')}
                    </GoToLiveDemo>
                </TabsWrapper>
                <VideoWrapper>
                    <MacbookFrame />

                    <Video
                        ref={this.my_ref}
                        controls={this.state.is_ios}
                        preload="metadata"
                        muted
                        playsinline
                    >
                        <source src="/Dtrader_GIF.mp4" type="video/mp4" />
                        <source src="/Dtrader_GIF.webm" type="video/webm" />
                    </Video>
                </VideoWrapper>
            </Container>
        )
    }
}
export default DtraderTabs

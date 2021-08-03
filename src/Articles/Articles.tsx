import React, { Fragment } from "react";
import { Article } from "../News.interfaces";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    PinterestShareButton,
    RedditShareButton,
    TelegramShareButton,
    TwitterShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    PinterestIcon,
    TelegramIcon,
    RedditIcon,
    EmailIcon,
} from "react-share";
import { Button } from "@material-ui/core";

/*global JSX*/
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            alignItems: 'stretch',
            display: 'flex',
            marginTop: '1rem',
            cursor: 'pointer',
            width: '100%',
            minHeight: '10rem',
        },
        details: {
            display: 'flex',
            flexDirection: 'column',
            flexBasis: 'auto',
            maxWidth: '70%',
            overflow: 'auto',
        },
        content: {
            flex: '1 0 auto',
        },
        image: {
            display: 'flex',
            margin: '0',
            width: '10rem',
            minWidth: '10rem',
            backgroundSize: 'auto 100%',
            backgroundPosition: 'center',
        },
        share: {
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            paddingLeft: theme.spacing(1),
            paddingBottom: theme.spacing(1),
        },
        heading: {
            padding: '2rem 0 1rem 0',
        },
        speakButton: {
            width: '10rem',
            marginBottom: '1rem',
            marginLeft: '1rem',
        },
        speakHeadlineButton: {
            marginLeft: '1rem',
        },
    }),
);

const Articles = (props: { articles: Article[], showFullArticle: (article: Article) => void }) => {
    const classes = useStyles();

    /**
     * 
     * @param newsStories 
     * @returns collection of JSX news cards
     */
    const getArticleCards = (articles: Article[]): JSX.Element[] => {
        let articleCards: JSX.Element[] = [];
        articles.forEach((article, index) => {
            articleCards.push((
                getArticleCard(article, index)
            ));
        })
        return articleCards;
    };

    /**
     * 
     * @param articleToRead 
     */
    const readLead = (articleToRead: Article) => {
        const synth = window.speechSynthesis;
        const utterThis = new SpeechSynthesisUtterance(articleToRead.lead_paragraph);
        utterThis.onend = function (event) {
            console.log('SpeechSynthesisUtterance.onend');
        }
        utterThis.onerror = function (event) {
            console.error('SpeechSynthesisUtterance.onerror');
        }
        synth.speak(utterThis);
    }

    /**
 * 
 * @param articleToRead 
 */
    const readHeadline = (articleToRead: Article) => {
        const synth = window.speechSynthesis;
        const utterThis = new SpeechSynthesisUtterance(articleToRead.headline);
        utterThis.onend = function (event) {
            console.log('SpeechSynthesisUtterance.onend');
        }
        utterThis.onerror = function (event) {
            console.error('SpeechSynthesisUtterance.onerror');
        }
        synth.speak(utterThis);
    }



    /**
     * 
     * @param article 
     */
    const getArticleCard = (article: Article, index: number): JSX.Element => {
        return (
            <Card key={`card-${index}`} className={classes.root} onClick={() => {
                props.showFullArticle(article);
            }}>
                {article.multimedia.url && <CardMedia
                    className={classes.image}
                    image={`https://www.nytimes.com/${article.multimedia.url}`}
                    title={article.headline}
                />}
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography component="h2" variant="h6">
                            {article.headline}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {article.byline}
                        </Typography>
                    </CardContent>
                    <Button className={classes.speakButton} variant="contained" color="primary" onClick={() => {
                        readLead(article);
                    }}>Speak Lead</Button>
                    <div className={classes.share}>
                        <EmailShareButton url={article.url} subject={article.headline} body={article.lead_paragraph}><EmailIcon size={32} round /></EmailShareButton>
                        <FacebookShareButton url={article.url} quote={article.headline}><FacebookIcon size={32} round /></FacebookShareButton>
                        <LinkedinShareButton url={article.url} title={article.headline} summary={article.lead_paragraph}><LinkedinIcon size={32} round /></LinkedinShareButton>
                        <PinterestShareButton url={article.url} media={article.multimedia.url || ""} description={article.headline}><PinterestIcon size={32} round /></PinterestShareButton>
                        <RedditShareButton url={article.url} title={article.headline} ><RedditIcon size={32} round /></RedditShareButton>
                        <TelegramShareButton url={article.url} title={article.headline}><TelegramIcon size={32} round /></TelegramShareButton>
                        <TwitterShareButton url={article.url} title={article.headline}><TwitterIcon size={32} round /></TwitterShareButton>
                    </div>
                </div>
            </Card>
        )
    };

    return (
        <Fragment>
            {props.articles.length > 0 && <Typography className={classes.heading} component="h1" variant="h4">Search Results
                <Button className={classes.speakHeadlineButton} variant="contained" color="primary" onClick={() => {
                    props.articles.forEach((gatheredArticle) => {
                        readHeadline(gatheredArticle);
                    })
                }}>Speak Headlines</Button></Typography>}
            {getArticleCards(props.articles)}
        </Fragment>
    );
}

export default Articles;
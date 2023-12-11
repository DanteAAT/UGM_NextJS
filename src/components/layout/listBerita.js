
import { useState, useEffect } from 'react';
import { Text, Button, Card, Modal } from "@mantine/core";
import styles from '@/styles/listBerita.module.css';
import { formatDate } from '@/features/home/formatDate';

export default function ListBerita() {
  const [berita, setBerita] = useState([]);
  const [beritaTerpopuler, setBeritaTerpopuler] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedBerita, setSelectedBerita] = useState(null);
  const [politikBerita, setPolitikBerita] = useState([]);

  useEffect(() => {
    fetch('https://newsapi.org/v2/top-headlines?country=us&pageSize=100&apiKey=ae6d30febe3846329c78a5ce095b66f3')
      .then((response) => response.json())
      .then((data) => {
        setBerita(data.articles);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    fetch('https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=100&apiKey=ae6d30febe3846329c78a5ce095b66f3')
      .then((response) => response.json())
      .then((data) => {
        const beritaDenganGambar = data.articles.filter(berita => berita.urlToImage !== null);
        setBeritaTerpopuler(beritaDenganGambar);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    fetch('https://newsapi.org/v2/everything?q=politik%20indonesia&pageSize=100&apiKey=ae6d30febe3846329c78a5ce095b66f3')
    .then((response) => response.json())
    .then((data) => {
      // setPolitikBerita(data.articles);
      const politikBeritaTidakKosong = data.articles.filter(berita => berita.urlToImage !== null);
      setPolitikBerita(politikBeritaTidakKosong);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, []); // Empty dependency array akan memastikan useEffect hanya dipanggil sekali saat komponen dimuat


  const nextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === berita.length - 1 ? 0 : prevSlide + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? berita.length - 1 : prevSlide - 1
    );
  };

  const openDetailBerita = (berita) => {
    setSelectedBerita(berita);
  };

  const closeDetailBerita = () => {
    setSelectedBerita(null);
  };
  const [showFullContent, setShowFullContent] = useState(false);


  useEffect(() => {
    const interval = setInterval(nextSlide, 3000); // Auto slide
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      {/* Berita Teratas  */}
      <div className={styles.content}>
        <div className={styles.slideshowWrapper}>
          <Text style={{ fontSize: '20px', fontWeight: 'bold', }}>| Berita Teratas United States</Text>
          <div className={styles.slideshow}>
            {berita.map((article, index) => (
              <div
                key={index}
                className={
                  index === currentSlide
                    ? `${styles.slide} ${styles.active}`
                    : styles.slide
                }
                style={{ backgroundImage: `url(${article.urlToImage})` }}
              >
                <div className={styles.slideDescription}>
                  <Text>{article.title}</Text>
                </div>
              </div>
            ))}
            <Button className={styles.prevButton} onClick={prevSlide}>
              {'<'}
            </Button>
            <Button className={styles.nextButton} onClick={nextSlide}>
              {'>'}
            </Button>
          </div>
        </div>
        {/* Berita Politik Indonesia */}
        <Text style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '10px'}}>| Berita Politik Indonesia</Text>
        <div className={styles.additionalContainer}>
          <div className={styles.columnContainer}>
            {politikBerita.map((berita, index) => (
              <div className={styles.containerBerita} key={index}>
              {berita.urlToImage && <img src={berita.urlToImage} alt={berita.title} />}
              <div className={styles.textDescription}>
               <Text fw={700}>{berita.title}</Text>
               {/* <Text>{berita.description}</Text> */}
               <Button variant="filled"><a href={berita.url}>Baca lebih lanjut</a></Button>
              </div>
          </div>
        ))}
      </div>
    </div>
      </div>

      {/* Berita Teknologi Terpopuler */}
      <div className={styles.popularNews}>
        <Text style={{ fontSize: '17px', fontWeight: 'bold', marginTop: '10px'}}>| Berita Teknologi Terpopuler</Text>
        {beritaTerpopuler.map((berita, index) => (
          <Card key={index} shadow="sm" className={styles.popularCard} onClick={() => openDetailBerita(berita)}>
            <img
              src={berita.urlToImage}
              alt={`Berita Terpopuler ${index + 1}`}
              className={styles.popularImage}
            />
            <div className={styles.popularCardContent}>
              <Text weight={500}>{berita.title}</Text>
              <Text size="sm">{berita.description}</Text>
            </div>
          </Card>
        ))}
      </div>
      
      <Modal opened={selectedBerita !== null} onClose={closeDetailBerita}>
        {selectedBerita && (
          <div>
            <Text fw={500}>Detail Berita</Text>
            <Text c="dimmed">Author: {selectedBerita.author}</Text>
            <Text c="dimmed">Publish Date: {formatDate(selectedBerita.publishedAt)}</Text>
          <div className={styles.detailBerita}>
            <img src={selectedBerita.urlToImage} alt={selectedBerita.title} />
            <Text weight={500}>{selectedBerita.title}</Text>
            {/* <Text size="sm">Deskripsi:{selectedBerita.description}</Text> */}
            <Text>{selectedBerita.content}</Text>
          </div>
          <Button variant="filled"><a style={{ textDecoration:'none', color:'white'}} href={selectedBerita.url}>Baca lebih lanjut</a></Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

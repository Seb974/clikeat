<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20191024071918 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE greeting');
        $this->addSql('ALTER TABLE variant ADD tva_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE variant ADD CONSTRAINT FK_F143BFAD4D79775F FOREIGN KEY (tva_id) REFERENCES tva (id)');
        $this->addSql('CREATE INDEX IDX_F143BFAD4D79775F ON variant (tva_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE greeting (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL COLLATE utf8_unicode_ci, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE variant DROP FOREIGN KEY FK_F143BFAD4D79775F');
        $this->addSql('DROP INDEX IDX_F143BFAD4D79775F ON variant');
        $this->addSql('ALTER TABLE variant DROP tva_id');
    }
}
